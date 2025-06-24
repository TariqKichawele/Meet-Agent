import { getQueryClient, trpc } from '@/app/trpc/server';
import AgentIdView, { AgentIdViewError, AgentIdViewSuspense } from '@/modules/agents/ui/views/AgentIdView';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
    params: Promise<{ agentId: string }>
}

const AgentPage = async ({ params }: Props) => {
    const { agentId } = await params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({
        id: agentId,
    }));

    const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<AgentIdViewSuspense />}>
            <ErrorBoundary fallback={<AgentIdViewError />}>
                <AgentIdView agentId={agentId} />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default AgentPage