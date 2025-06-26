import EmptyState from '@/components/EmptyState'
import React from 'react'

const ProcessingState = () => {
  return (
    <div className='bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center'>
        <EmptyState 
            title='Processing...'
            description='The meeting is being processed. Please wait...'
            image='/processing.svg'
        />
    </div>
  )
}

export default ProcessingState