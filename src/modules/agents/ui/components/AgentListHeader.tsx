'use client';

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import NewAgentDialog from './NewAgentDialog';

const AgentListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <div className='flex items-center justify-between'>
                <h5>My Agents</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon className='w-4 h-4' />
                    New Agent 
                </Button>
            </div>
        </div>
    </>
  )
}

export default AgentListHeader