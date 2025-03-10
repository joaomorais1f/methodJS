import { CalendarDays } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="grid grid-cols-2">
      <div className="bg-muted border-foreground/5 flex min-h-[100dvh] flex-col justify-between border-r p-10">
        <header className="text-foreground flex items-center gap-3 text-lg">
          <CalendarDays className="size-5" />
          <span className="font-semibold">Méthod 24</span>
        </header>
        <footer>
          <span className="text-sm">
            Painel de revisão de conteúdos &copy; method - {currentYear}
          </span>
        </footer>
      </div>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
