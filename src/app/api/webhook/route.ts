import {
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk"
import { db } from "@/db"
import { agents, meetings } from "@/db/schema"
import { streamVideo } from "@/lib/stream-video"
import { NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(request: Request) {
    const signature = request.headers.get("x-signature");
    const apiKey = request.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json({ error: "Missing signature or api key" }, { status: 400 });
    }

    const body = await request.text();
    const isValid = verifySignatureWithSDK(body, signature);

    if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let payload: unknown;

    try {
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = (payload as Record<string, unknown>).type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const [meeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "cancelled")),
                )
            )
            

        if (!meeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        }

        await db
        .update(meetings)
        .set({
            status: "active",
            startedAt: new Date()
        })
        .where(eq(meetings.id, meetingId));

        const [agent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, meeting.agentId));

        if (!agent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const call = streamVideo.video.call("default", meetingId);
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: agent.id,
        });

        realtimeClient.updateSession({
            instructions: agent.instructions,
        });
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    }

    return NextResponse.json({ status: "ok" });


}