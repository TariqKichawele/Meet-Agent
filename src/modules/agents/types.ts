import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/app/trpc/routers/_app";

export type AgentGetOneOutput = inferRouterOutputs<AppRouter>['agents']['getOne'];
export type AgentGetManyOutput = inferRouterOutputs<AppRouter>['agents']['getMany']['items'];