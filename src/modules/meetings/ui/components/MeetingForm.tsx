import React, { useState } from 'react'
import { MeetingGetOne } from '@/modules/meetings/types';
import { meetingsInsertSchema } from '../../schemas';
import { useTRPC } from '@/app/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; 
import CommandSelect from '@/components/CommandSelect';
import GeneratedAvatar from '@/components/GeneratedAvatar';
import { useRouter } from 'next/navigation';
import NewAgentDialog from '@/modules/agents/ui/components/NewAgentDialog';

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [agentSearch, setAgentSearch] = useState('');
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                onSuccess?.(data.id); 
                toast.success('Meeting created successfully');
                router.push(`/meetings/${data.id}`);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({
                            id: initialValues.id,
                        }),
                    );
                }

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        defaultValues: {
            name: initialValues?.name ?? '',
            agentId: initialValues?.agentId ?? '',
        },
        resolver: zodResolver(meetingsInsertSchema),
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (data: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ ...data, id: initialValues.id });
        } else {
            createMeeting.mutate(data);
        }
    };

    return (
        <>
            <NewAgentDialog
                open={openNewAgentDialog}
                onOpenChange={setOpenNewAgentDialog}
            />
            <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                <FormField 
                                    name='name'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-y-2'>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Enter agent name' disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='agentId'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-y-2'>
                                            <FormLabel>Agent</FormLabel>
                                            <FormControl>
                                                <CommandSelect
                                                    options={agents.data?.items.map((agent) => ({
                                                        id: agent.id,
                                                        value: agent.id,
                                                        children: (
                                                            <div className='flex items-center gap-x-2'>
                                                                <GeneratedAvatar
                                                                    seed={agent.name}
                                                                    variant='botttsNeutral'
                                                                    className='border size-6'
                                                                />
                                                                <span>{agent.name}</span>
                                                            </div>
                                                        ),
                                                    })) ?? []}
                                                    onSelect={field.onChange}
                                                    onSearch={setAgentSearch}
                                                    value={field.value}
                                                    placeholder='Select an agent'
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Not found what you&apos;re looking for?{' '}
                                                <button
                                                    type='button'
                                                    className='text-primary hover:underline'
                                                    onClick={() => setOpenNewAgentDialog(true)}
                                                >
                                                    Create a new agent
                                                </button>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex justify-between gap-x-2'>
                                    {onCancel && (
                                        <Button variant='ghost' disabled={isPending} type='button' onClick={onCancel}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type='submit' disabled={isPending}>
                                        {isEdit ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
            </Form>
        </>
    );
};

export default MeetingForm