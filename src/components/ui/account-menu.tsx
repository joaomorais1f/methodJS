import { ChevronDown, Laptop, LogOut, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex cursor-pointer items-center gap-2 select-none"
        >
          João Morais
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span> João Victor Ferreira de Morais </span>
          <span className="text-muted-foreground text-sm font-normal">
            ifsp.joaov@gmail.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <NavLink to="/profile">
            <User />
            <span> Perfil do usuário </span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <NavLink to="/contents">
            <Laptop />
            <span> Conteúdos </span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-rose-500 hover:!text-rose-400 dark:text-rose-400">
          <LogOut className="text-rose-500 dark:text-rose-400" />
          <span> Sair </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
