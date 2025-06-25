import React, { ReactNode, useState } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { 
    CommandEmpty, 
    CommandInput, 
    CommandItem, 
    CommandList, 
    CommandResponsiveDialog 
} from './ui/command'

interface CommandSelectProps {
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}


const CommandSelect = ({ 
    options, 
    onSelect, 
    onSearch, 
    value, 
    placeholder = 'Select an option', 
    isSearchable = true, 
    className 
}: CommandSelectProps) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    
  return (
    <>
        <Button
            onClick={() => setOpen(true)}
            variant='outline'
            className={cn( 
                'justify-between font-normal px-2 h-9',
                !selectedOption && 'text-muted-foreground',
                className
            )}
            type='button'
        >
            <div>
                {selectedOption?.children ?? placeholder}
            </div>
            <ChevronsUpDownIcon className='size-4' />
        </Button>
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            shouldFilter={!onSearch}
        >
            <CommandInput placeholder='Search...' onValueChange={onSearch} />
            <CommandList>
                <CommandEmpty>
                    <span className='text-muted-foreground text-sm'>No results found.</span>
                </CommandEmpty>
                {options.map((option) => (
                    <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={() => onSelect(option.value)}
                    >
                        {option.children}
                    </CommandItem>
                ))}
            </CommandList>
        </CommandResponsiveDialog>
    </>
  )
}

export default CommandSelect