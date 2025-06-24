"use client"

import { useTRPC } from '@/app/trpc/client';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import AgentIdViewHeader from '../components/AgentIdViewHeader';
import GeneratedAvatar from '@/components/GeneratedAvatar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';
import UpdateAgentDialog from '../components/UpdateAgentDialog';

interface Props {
    agentId: string;
}

const AgentIdView = ({ agentId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({
        id: agentId,
    }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                router.push('/agents');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        `The following action will remove ${data.meetingCount} associated meetings and all of their data.`
    );

    const handleRemove = async () => {
        const confirmed = await confirm();
        if (confirmed) {
            await removeAgent.mutateAsync({ id: agentId });
        }
    }

  return (
    <>
        <ConfirmDialog />
        <UpdateAgentDialog
            open={updateAgentDialogOpen}
            onOpenChange={setUpdateAgentDialogOpen}
            initialValues={data}
        />
        <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <AgentIdViewHeader 
                agentId={agentId}
                agentName={data.name}
                onEdit={() => setUpdateAgentDialogOpen(true)}
                onRemove={handleRemove}
            />
            <div className='bg-white rounded-lg border'>
                <div className='px-4 py-5 gap-y-5 flex flex-col col-span-5'>
                    <div className='flex items-center gap-x-3'>
                        <GeneratedAvatar 
                            seed={data.name}
                            variant='botttsNeutral'
                            className='size-10'
                        />

                        <h2 className='text-2xl font-medium'>{data.name}</h2>
                    </div>
                    <Badge
                        variant='outline'
                        className='flex items-center gap-x-2 [&>svg]:size-4'
                    >
                        <VideoIcon className='text-blue-700'/>
                        {data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'}
                    </Badge>
                    <div className='flex flex-col gap-y-4'>
                        <p className='text-lg font-medium'>Instructions</p>
                        <p className='text-neutral-800'>
                            {data.instructions}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AgentIdView

export const AgentIdViewSuspense = () => {
    return (
        <LoadingState 
            title='Loading agent...'
            description='We are fetching the agent from the database...'
        />
    )
}

export const AgentIdViewError = () => {
    return (
        <ErrorState
            title='Error loading agent'
            description='We were unable to fetch the agent from the database. Please try again later.'
        />
    )
}