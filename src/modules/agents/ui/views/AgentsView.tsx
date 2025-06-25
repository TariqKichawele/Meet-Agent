"use client";

import { useTRPC } from '@/app/trpc/client'
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { DataTable } from '@/components/DataTable';
import { columns } from '../components/Columns';
import EmptyState from '@/components/EmptyState';
import { useAgentsFilters } from '@/modules/agents/hooks/useAgentsFilters';
import DataPagination from '../components/DataPagination';
import { useRouter } from 'next/navigation';

const AgentsView = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const [filters, setFilters] = useAgentsFilters();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
        <DataTable
            columns={columns} 
            data={data.items} 
            onRowClick={(row) => router.push(`/agents/${row.id}`)} 
        />
        <DataPagination 
            page={filters.page} 
            totalPages={data.totalPages}    
            onPageChange={(page) => setFilters({ page })} 
        />
        {data.items.length === 0 && (
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