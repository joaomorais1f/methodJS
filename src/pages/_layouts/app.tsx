import { Outlet } from 'react-router-dom'

import { HeaderMobile } from '@/components/ui/header-mobile'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased lg:p-3">
      <HeaderMobile />
      <div className="flex flex-1 flex-col pr-3 pl-3 lg:pl-0">
        <Outlet />
      </div>
    </div>
  )
}
