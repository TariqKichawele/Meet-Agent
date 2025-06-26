'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, XCircleIcon } from 'lucide-react';
import React, { useState } from 'react'
import NewMeetingDialog from './NewMeetingDialog';
import MeetingsSearchFilter from './MeetingsSearchFilter';
import StatusFilter from './StatusFilter';
import AgentIdFilter from './AgentIdFilter';
import { useMeetingsFilter } from '@/modules/meetings/hooks/useMeetingsFilter';
import { DEFAULT_PAGE } from '@/constants';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const MeetingsListHeader = () => {
    const [filters, setFilters] = useMeetingsFilter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = 
        !!filters.status || 
        !!filters.search || 
        !!filters.agentId;

    const onClearFilters = () => {
        setFilters({
            status: null,
            search: "",
            agentId: "",
            page: DEFAULT_PAGE,
        });
    }

  return (
    <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <div className='flex items-center justify-between'>
                <h5 className='font-medium text-xl'>My Meetings</h5>
                <Button onClick={() => setIsDialogOpen(true)} className='gap-x-2'>
                    <PlusIcon className='size-4' />
                    New Meeting 
                </Button>
            </div>

           <ScrollArea>
                <div className='flex items-center gap-x-2 p-1'>
                    <MeetingsSearchFilter />
                    <StatusFilter />
                    <AgentIdFilter />
                    {
                        isAnyFilterModified && (
                            <Button variant="outline" onClick={onClearFilters}>
                                <XCircleIcon className='size-4' />
                                Clear 
                            </Button>
                        )
                    }
                </div>
            <ScrollBar orientation='horizontal' />
           </ScrollArea>
        </div>
    </>
  )
}

export default MeetingsListHeader