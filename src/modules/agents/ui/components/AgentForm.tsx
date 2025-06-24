import React from 'react'
import { AgentGetOneOutput } from '../../types';
import { useTRPC } from '@/app/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { agentsInsertSchema } from '../../schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GeneratedAvatar from '@/components/GeneratedAvatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOneOutput
}

const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();


    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({
                            id: initialValues.id,
                        }),
                    );
                }

                onSuccess?.();
            },
        })
    );

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        defaultValues: {
            name: initialValues?.name ?? '',
            instructions: initialValues?.instructions ?? '',
        },
        resolver: zodResolver(agentsInsertSchema),
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({
                ...data,
                id: initialValues!.id,
            });
        } else {
            createAgent.mutate(data);
        }
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <GeneratedAvatar 
                seed={form.watch('name')}
                variant='botttsNeutral'
                className='border size-16'
            />
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
                name='instructions'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-y-2'>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder='Enter agent instructions'
                                disabled={isPending}
                            />
                        </FormControl>
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
  )
}

export default AgentForm