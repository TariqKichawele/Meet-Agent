import EmptyState from '@/components/EmptyState'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { VideoIcon, BanIcon } from 'lucide-react'

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className='bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center'>
        <EmptyState 
            title='Not started yet'
            description='The meeting has not started yet'
            image='/upcoming.svg'
        />
        <div className='flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full'>
            <Button 
                variant={'secondary'} 
                className='w-full lg:w-auto' 
                onClick={onCancelMeeting} 
                disabled={isCancelling}
            >
                <BanIcon />
                Cancel Meeting
            </Button>
            <Button asChild className='w-full lg:w-auto' disabled={isCancelling}>
                <Link href={`/call/${meetingId}`}>
                    <VideoIcon />
                    Join Meeting
                </Link>
            </Button>
        </div>
    </div>
  )
}

export default UpcomingState