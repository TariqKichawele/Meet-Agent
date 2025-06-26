import { getQueryClient, trpc } from '@/app/trpc/server';
import { auth } from '@/lib/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import MeetingIdView, { MeetingIdViewError, MeetingIdViewSuspense } from '@/modules/meetings/ui/views/MeetingIdView';

interface Props {
  params: Promise<{ meetingId: string }>
}

const MeetingPage = async ({ params }: Props) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<MeetingIdViewSuspense />}>
        <ErrorBoundary fallback={<MeetingIdViewError />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default MeetingPage;