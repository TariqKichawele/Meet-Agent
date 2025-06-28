"use client";

import { useTRPC } from '@/app/trpc/client';
import ErrorState from '@/components/ErrorState';
import { CallProvider } from '@/modules/call/ui/components/CallProvider';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

interface Props {
    meetingId: string;
}

const CallView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    );

    if (data?.status === "completed") {
        return (
            <div className='flex h-screen items-center justify-center'>
                <ErrorState 
                    title='Meeting has ended'
                    description='The meeting has ended. Please contact the meeting organizer for more information.'
                />
            </div>
        )
    }

    if (!data) {
            return <div>Loading...</div>;
        }

  return (
    <div>
        <CallProvider meetingId={meetingId} meetingName={data.name} />
    </div>
  )
}

export default CallView