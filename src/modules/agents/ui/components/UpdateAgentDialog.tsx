import ResponsiveDialog from '@/components/ResponsiveDialog';
import React from 'react'
import AgentForm from './AgentForm';
import { AgentGetOneOutput } from '../../types';


interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentGetOneOutput
}

const UpdateAgentDialog = ({ open, onOpenChange, initialValues }: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        title='Update Agent'
        description='Update the agent'
    >
        <AgentForm 
            onSuccess={() => {
                onOpenChange(false);
            }}
            onCancel={() => {
                onOpenChange(false);
            }}
            initialValues={initialValues}
        />
    </ResponsiveDialog>
  )
}

export default UpdateAgentDialog