import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/app/trpc/client'
import { useMeetingsFilter } from '@/modules/meetings/hooks/useMeetingsFilter'
import CommandSelect from '@/components/CommandSelect'
import GeneratedAvatar from '@/components/GeneratedAvatar'

const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilter();
    const trpc = useTRPC();

    const [agentSearch, setAgentSearch] = useState("");
    const { data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        })
    );

  return (
    <CommandSelect 
        className="h-9"
        placeholder="Agent"
        options={(data?.items ?? []).map((agent) => ({
            id: agent.id,
            value: agent.id,
            children: (
                <div className='flex items-center gap-x-2 capitalize'>
                    <GeneratedAvatar 
                        seed={agent.name}
                        variant='botttsNeutral'
                        className='size-4'
                    />
                    {agent.name}
                </div>
            )
        }))}
        onSelect={(value) => setFilters({ agentId: value as string })}
        onSearch={setAgentSearch}
        value={filters.agentId ?? ""}
    />
  )
}

export default AgentIdFilter