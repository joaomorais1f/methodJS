import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="bg-muted flex min-h-[100dvh] flex-col items-center justify-center">
      <Outlet />
    </div>
  )
}
