'use client';

import { useTRPC } from '@/app/trpc/client';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
        {JSON.stringify(data)}
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