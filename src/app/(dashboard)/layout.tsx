import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardNavbar from '@/modules/dashboard/ui/components/DashboardNavbar'
import DashboardSidebar from '@/modules/dashboard/ui/components/DashboardSidebar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className='flex flex-col h-screen w-screen bg-muted'>
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout