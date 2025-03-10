import { CalendarDays } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="grid antialiased lg:grid-cols-2">
      <div className="bg-muted border-foreground/5 hidden min-h-[100dvh] flex-col justify-between border-r p-10 lg:flex">
        <header className="text-foreground flex items-center gap-3 text-lg">
          <CalendarDays className="size-5" />
          <span className="font-semibold">Méthod 24/7/30</span>
        </header>
        <footer>
          <span className="text-sm">
            Painel de revisão de conteúdos &copy; method 24/7/30 - {currentYear}
          </span>
        </footer>
      </div>
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
