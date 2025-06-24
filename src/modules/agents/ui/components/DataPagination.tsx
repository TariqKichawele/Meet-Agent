import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <div className='flex items-center justify-between'>
        <div className='flex-1 text-sm text-muted-foreground'>
            Page {page} of {totalPages || 1}
        </div>
        <div className='flex items-center space-x-2 justify-end'>
            <Button
                variant='outline'
                size='sm'
                disabled={page === 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
            >
                Previous
            </Button>
            <Button
                variant='outline'
                size='sm'
                disabled={page === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            >
                Next
            </Button>
        </div>
    </div>
  )
}

export default DataPagination