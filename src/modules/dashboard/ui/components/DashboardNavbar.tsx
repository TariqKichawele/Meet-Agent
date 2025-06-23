'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import DashboardCommand from './DashboardCommand';

const DashboardNavbar = () => {
    const { toggleSidebar, isMobile, state } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);
 
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if(e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
            }
        }

        window.addEventListener('keydown', down);

        return () => window.removeEventListener('keydown', down);
    }, [])
  return (
    <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
        <nav className='flex px-4 gap-x-2 items-center py-3 border-b bg-background'>
            <Button className='size-9' variant={'outline'} onClick={toggleSidebar}>
                {(state === 'collapsed' || isMobile) 
                    ? <PanelLeftIcon className='size-4' /> 
                    : <PanelLeftCloseIcon className='size-4' />
                }
            </Button>
            <Button 
                variant={'outline'} 
                size={'sm'} 
                onClick={() => setCommandOpen((prev) => !prev)} 
                className='h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground'
            >
                <SearchIcon className='size-4' />
                <span className='text-sm'>Search</span>
                <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                    <span className='text-xs'>⌘</span>K
                </kbd>
            </Button>
        </nav>
    </>
  )
}

export default DashboardNavbar