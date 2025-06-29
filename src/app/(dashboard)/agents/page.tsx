import { trpc } from '@/app/trpc/server';
import { getQueryClient } from '@/app/trpc/server';
import AgentsView, { AgentsViewError, AgentsViewSuspense } from '@/modules/agents/ui/views/AgentsView';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import AgentListHeader from '@/modules/agents/ui/components/AgentListHeader';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { SearchParams } from 'nuqs';
import { loadSearchParams } from '@/modules/agents/params';

interface Props {
    searchParams: Promise<SearchParams>
}

const Agents = async ({ searchParams }: Props) => {
    const filters = await loadSearchParams(searchParams);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    const dehydratedState = dehydrate(queryClient);

  return (
    <>
        <AgentListHeader />
        <HydrationBoundary state={dehydratedState}>
            <Suspense fallback={<AgentsViewSuspense />}>
                <ErrorBoundary fallback={<AgentsViewError />}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </>
  )
}

export default Agents;