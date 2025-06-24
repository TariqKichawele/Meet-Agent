import { getQueryClient, trpc } from '@/app/trpc/server';
import MeetingsView, { MeetingsViewError, MeetingsViewSuspense } from '@/modules/meetings/ui/views/MeetingsView';
import { dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const MeetingsPage = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));
    const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<MeetingsViewSuspense />}>
            <ErrorBoundary fallback={<MeetingsViewError />}>
                <MeetingsView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default MeetingsPage;
