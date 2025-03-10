import { CalendarDays } from 'lucide-react'

export function Dashboard() {
  return (
    <main className="flex flex-col">
      <header className="flex p-3">
        <div className="flex items-center gap-3">
          <h1 className="text-foreground flex items-center gap-3 text-lg font-semibold">
            Method 24/7/30
          </h1>
          <CalendarDays className="size-5" />
        </div>
      </header>
    </main>
  )
}
