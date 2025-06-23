"use client";

import { useTRPC } from '@/app/trpc/client'
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
        {JSON.stringify(data, null, 2)}
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