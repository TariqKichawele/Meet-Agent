'use client';

import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import NewAgentDialog from './NewAgentDialog';
import { useAgentsFilters } from '@/modules/agents/hooks/useAgentsFilters';
import AgentsSearchFilter from './AgentsSearchFilter';
import { DEFAULT_PAGE } from '@/constants';

const AgentListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useAgentsFilters();

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({ search: "", page: DEFAULT_PAGE });
    }
  return (
    <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <div className='flex items-center justify-between'>
                <h5>My Agents</h5>
                <Button onClick={() => setIsDialogOpen(true)} className='gap-x-2'>
                    <PlusIcon className='size-4' />
                    New Agent 
                </Button>
            </div>
            <div className='flex items-center gap-x-2 p-1'>
                <AgentsSearchFilter />
                {isAnyFilterModified && (
                    <Button variant='outline' size='sm' onClick={onClearFilters}>
                        <XCircleIcon />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    </>
  )
}

export default AgentListHeader