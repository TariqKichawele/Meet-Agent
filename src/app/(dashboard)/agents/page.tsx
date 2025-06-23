import { trpc } from '@/app/trpc/server';
import { getQueryClient } from '@/app/trpc/server';
import AgentsView, { AgentsViewError, AgentsViewSuspense } from '@/modules/agents/ui/views/AgentsView';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import React, { Suspense } from 'react'

const Agents = async () => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<AgentsViewSuspense />}>
            <ErrorBoundary fallback={<AgentsViewError />}>
                <AgentsView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default Agents;