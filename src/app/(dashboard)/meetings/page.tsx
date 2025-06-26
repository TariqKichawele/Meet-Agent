import { getQueryClient, trpc } from '@/app/trpc/server';
import { auth } from '@/lib/auth';
import MeetingsListHeader from '@/modules/meetings/ui/components/MeetingsListHeader';
import MeetingsView, { MeetingsViewError, MeetingsViewSuspense } from '@/modules/meetings/ui/views/MeetingsView';
import { dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { loadSearchParams } from '@/modules/meetings/params';
import type { SearchParams } from 'nuqs';

interface Props {
  searchParams: Promise<SearchParams>
}

const MeetingsPage = async ({ searchParams }: Props) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/sign-in");
    }

    const params = await loadSearchParams(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
      ...params,
    }));
    const dehydratedState = dehydrate(queryClient);
    
  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydratedState}>
          <Suspense fallback={<MeetingsViewSuspense />}>
              <ErrorBoundary fallback={<MeetingsViewError />}>
                  <MeetingsView />
              </ErrorBoundary>
          </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default MeetingsPage;
