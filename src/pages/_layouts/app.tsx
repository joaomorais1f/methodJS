import { Outlet } from 'react-router-dom'

import { HeaderMobile } from '@/components/ui/header-mobile'

export function AppLayout() {
  return (
    <div className="antialiased">
      <HeaderMobile />
      <div className="flex flex-1 flex-col pl-3 lg:pl-0">
        <Outlet />
      </div>
    </div>
  )
}
