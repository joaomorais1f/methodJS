import { CalendarDays } from 'lucide-react'

import { Calendar } from '@/components/calendar/calendar'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { AccountMenu } from '@/components/ui/account-menu'
import { FloatingButton } from '@/components/ui/floating-button'

export function Dashboard() {
  return (
    <main className="relative flex flex-1 flex-col">
      <header className="flex">
        <div className="flex items-center gap-3">
          <h1 className="text-foreground flex items-center gap-3 text-lg font-semibold">
            Method 24/7/30
          </h1>
          <CalendarDays className="size-5" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:flex">
            <AccountMenu />
          </div>
        </div>
      </header>
      <Calendar />
      <div className="absolute right-4 bottom-4">
        <FloatingButton />
      </div>
    </main>
  )
}
