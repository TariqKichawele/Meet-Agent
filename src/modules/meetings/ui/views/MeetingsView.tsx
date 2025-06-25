'use client';

import { useTRPC } from '@/app/trpc/client';
import { DataTable } from '@/components/DataTable';
import ErrorState from '@/components/ErrorState';
import { columns } from '@/modules/meetings/ui/components/Columns';
import LoadingState from '@/components/LoadingState';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import EmptyState from '@/components/EmptyState';

const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <DataTable
            columns={columns}
            data={data.items}
        />
        {data.items.length === 0 && (
            <EmptyState
                title='No meetings found'
                description='You have not created any meetings yet. Click the button above to create your first meeting.'
            />
        )}
    </div>
  )
}

export default MeetingsView

export const MeetingsViewSuspense = () => {
    return (
        <LoadingState 
            title='Loading meetings...'
            description='We are fetching your meetings from the database...'    
        />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title='Error loading meetings...'
            description='We are unable to fetch your meetings from the database...'
        />
    )
}