'use client';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useTRPC } from '@/app/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import MeetingIdViewHeader from './MeetingIdViewHeader';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/hooks/use-confirm';
import UpdateMeetingDialog from '../components/UpdateMeetingDialog';
import UpcomingState from '../components/UpcomingState';
import ActiveState from '../components/ActiveState';
import CancelledState from '../components/CancelledState';
import ProcessingState from '../components/ProcessingState';

interface Props {
  meetingId: string;
}

const MeetingIdView = ({ meetingId }: Props) => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    const [RemoveConfirmation, confirmRemove ] = useConfirm(
        "Remove meeting",
        "Are you sure you want to remove this meeting? This action cannot be undone.",
    )

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push('/meetings');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    )

    const handleRemove = async () => {
        const ok = await confirmRemove();

        if(!ok) return;

        await removeMeeting.mutateAsync({ id: meetingId });
    }

    const isActive = data.status === 'active';
    const isUpcoming = data.status === 'upcoming';
    const isCancelled = data.status === 'cancelled';
    const isCompleted = data.status === 'completed';
    const isProcessing = data.status === 'processing';

  return (
    <>
        <RemoveConfirmation />
        <UpdateMeetingDialog
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            initialValues={data}
        />
        <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data.name}
                onEdit={() => setUpdateDialogOpen(true)}
                onRemove={handleRemove} 
            />
           {isCancelled && <CancelledState />}
           {isUpcoming && ( 
                <UpcomingState 
                    meetingId={meetingId}
                    onCancelMeeting={handleRemove}
                    isCancelling={removeMeeting.isPending}
                />
            )}
           {isActive && <ActiveState meetingId={meetingId} />}
           {isCompleted && <div>Completed</div>}
           {isProcessing && <ProcessingState />}
        </div>
    </>
  )
}

export default MeetingIdView


export const MeetingIdViewSuspense = () => {
  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <LoadingState
            title='Loading meeting...'
            description='Please wait while we load the meeting details.'
        />
    </div>
  )
}

export const MeetingIdViewError = () => {
  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <ErrorState
            title='Error loading meeting'
            description='Please try again later.'
        />
    </div>
  )
}