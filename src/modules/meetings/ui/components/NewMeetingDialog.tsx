'use client';

import React from 'react'
import ResponsiveDialog from '@/components/ResponsiveDialog';
import MeetingForm from './MeetingForm';
import { useRouter } from 'next/navigation';

interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
    const router = useRouter();
  return (
    <ResponsiveDialog 
        open={open} 
        onOpenChange={onOpenChange}
        title='New Meeting'
        description='Create a new meeting'
    >
        <MeetingForm 
            onSuccess={(id) => {
                onOpenChange(false);
                router.push(`/meetings/${id}`);
            }}
            onCancel={() => {
                onOpenChange(false);
            }}
        />
    </ResponsiveDialog>
  )
}

export default NewMeetingDialog