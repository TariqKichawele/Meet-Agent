'use client';

import React from 'react'
import ResponsiveDialog from '@/components/ResponsiveDialog';
import MeetingForm from './MeetingForm';
import { MeetingGetOne } from '../../types';

interface UpdateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
}

const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog 
        open={open} 
        onOpenChange={onOpenChange}
        title='Update Meeting'
        description='Update the meeting'
    >
        <MeetingForm 
            initialValues={initialValues}
            onSuccess={() => {
                onOpenChange(false);
            }}
            onCancel={() => {
                onOpenChange(false);
            }}
        />
    </ResponsiveDialog>
  )
}

export default UpdateMeetingDialog;