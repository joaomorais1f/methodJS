import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from './button'

export function HeaderMobile() {
  const [openHeader, setOpenHeader] = useState(false)

  function handleHeader() {
    setOpenHeader(!openHeader)
  }

  return (
    <div className="lg:hidden">
      {/* Botão para abrir o Header */}
      <Button
        variant="outline"
        onClick={handleHeader}
        className="m-3 cursor-pointer"
      >
        <Menu className="size-4" />
      </Button>

      {/* Header com visibilidade dinâmica */}
      <header
        className={`bg-muted fixed top-0 left-0 h-screen overflow-hidden transition-all duration-300 ${
          openHeader
            ? 'visible w-[90%] opacity-100 sm:w-[300px]'
            : 'invisible w-0 opacity-0'
        } p-3`}
      >
        <nav className="flex h-full flex-col gap-3">
          <div className="flex justify-between">
            <h1
              className={`text-foreground text-lg font-bold transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[0ms]' : 'opacity-0'
              }`}
            >
              Method 24/7/30
            </h1>
            <Button
              onClick={handleHeader}
              className={`cursor-pointer transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[50ms]' : 'opacity-0'
              }`}
            >
              <X className="size-4" />
            </Button>
          </div>
          <ul className="flex h-full flex-col gap-3">
            <li
              className={`transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[100ms]' : 'opacity-0'
              }`}
            >
              <Button className="w-full cursor-pointer">Hoje</Button>
            </li>
            <li
              className={`transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[200ms]' : 'opacity-0'
              }`}
            >
              <Button className="w-full cursor-pointer">Semana</Button>
            </li>
            <li
              className={`transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[300ms]' : 'opacity-0'
              }`}
            >
              <Button className="w-full cursor-pointer">Mês</Button>
            </li>
            <li
              className={`mt-auto transition-opacity duration-300 ${
                openHeader ? 'opacity-100 delay-[400ms]' : 'opacity-0'
              }`}
            >
              <Button variant="destructive" className="w-full cursor-pointer">
                Sair
              </Button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}
