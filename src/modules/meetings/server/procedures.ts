import { createTRPCRouter, protectedProcedure } from "@/app/trpc/init";
import { MAX_PAGE_SIZE } from "@/constants";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { and, count, desc, getTableColumns, ilike, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";


export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            await streamVideo.upsertUsers([
                {
                    id: ctx.auth.user.id,
                    name: ctx.auth.user.name,
                    role: 'admin',
                    image: ctx.auth.user.image ?? generateAvatarUri({ 
                        seed: ctx.auth.user.id,
                        variant: 'initials',
                    }), 
                }
            ]);

            const expirationTime = Math.floor(Date.now() / 1000) + 3600;
            const issuedAt = Math.floor(Date.now() / 1000) - 60;

            const token = streamVideo.generateUserToken({
                user_id: ctx.auth.user.id,
                exp: expirationTime,
                validity_in_seconds: issuedAt,
            });

            return token;
        }),
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => { 
            const [meeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            const call = streamVideo.video.call("default", meeting.id);
            
            await call.create({
                data: {
                    created_by_id: ctx.auth.user.id,
                    custom: {
                        meetingId: meeting.id,
                        meetingName: meeting.name
                    },
                    settings_override: {
                        transcription: {
                            language: 'en',
                            mode: "auto-on",
                            closed_caption_mode: "auto-on"
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p",
                        }
                    }
                }
            });

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, meeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found",
                });
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generateAvatarUri({
                        seed: existingAgent.name,
                        variant: "botttsNeutral",
                    })
                },
            ]);

    
            return meeting;
        }),

    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [meeting] = await db
                .update(meetings)
                .set(input)
                .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
                .returning();

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return meeting;
        }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().min(1).default(1),
            pageSize: z.number().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Completed,
                MeetingStatus.Processing,
                MeetingStatus.Cancelled,
            ]).nullish(),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize, search, agentId, status } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), 
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), 
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);
            
            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ input, ctx }) => {
            const { id } = input;

            const [meeting ]= await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, id)))

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return meeting;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [meeting] = await db
                .delete(meetings)
                .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
                .returning();

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return meeting;
        }),
})