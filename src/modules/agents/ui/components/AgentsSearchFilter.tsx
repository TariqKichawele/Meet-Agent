import React from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAgentsFilters } from '@/modules/agents/hooks/useAgentsFilters'

const AgentsSearchFilter = () => {
    const [filters, setFilters] = useAgentsFilters();
  return (
    <div className='relative'>
        <Input 
            placeholder='Search agents...' 
            value={filters.search} 
            onChange={(e) => setFilters({ search: e.target.value })} 
            className='h-9 bg-white w-[200px] pl-7'
        />
        <SearchIcon className='size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
    </div>
  )
}

export default AgentsSearchFilter