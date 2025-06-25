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


export const meetingsRouter = createTRPCRouter({
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
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize, search } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(and(eq(meetings.userId, ctx.auth.user.id), search ? ilike(meetings.name, `%${search}%`) : undefined))
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(eq(meetings.userId, ctx.auth.user.id), search ? ilike(meetings.name, `%${search}%`) : undefined));

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
                })
                .from(meetings)
                .where(and(eq(meetings.userId, ctx.auth.user.id), eq(meetings.id, id)))

            if (!meeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return meeting;
        }),
})