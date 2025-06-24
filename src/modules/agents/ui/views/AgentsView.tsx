"use client";

import { useTRPC } from '@/app/trpc/client'
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { DataTable } from '../components/DataTable';
import { columns } from '../components/Columns';
import EmptyState from '@/components/EmptyState';

const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
        {data.length > 0 ? (
            <DataTable columns={columns} data={data} />
        ) : (
            <EmptyState
                title='No agents found'
                description='You have not created any agents yet. Click the button above to create your first agent.'
            />
        )}
    </div>
  )
}

export const AgentsViewSuspense = () => {
    return (
        <LoadingState 
            title='Loading agents...'
            description='We are fetching your agents from the database...'
        />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title='Error loading agents...'
            description='We are unable to fetch your agents from the database...'
        />
    )
}

export default AgentsView