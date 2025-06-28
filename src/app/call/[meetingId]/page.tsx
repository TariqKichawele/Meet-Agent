import { auth } from '@/lib/auth';
import { trpc, getQueryClient } from '@/app/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import CallView from '@/modules/call/ui/views/CallView';

interface Props {
    params: Promise<{ meetingId: string }>;
}

const CallPage = async ({ params }: Props) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

    const { meetingId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    )

    const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
        <CallView meetingId={meetingId} />
    </HydrationBoundary>
  )
}

export default CallPage