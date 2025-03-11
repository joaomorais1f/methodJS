'use client'

import { Plus } from 'lucide-react'

import { Button } from './button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { Input } from './input'
import { Label } from './label'

export function FloatingButton() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="pb-0">
            <DrawerTitle> Adicionar conteúdo </DrawerTitle>
            <DrawerDescription>
              Preencha as informações abaixo para adicionar um novo conteúdo a
              revisar.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center">
              <form className="grid w-full gap-3">
                <Label htmlFor="content"> Conteúdo </Label>
                <Input id="content" type="text" name="content" />
              </form>
            </div>
          </div>
          <DrawerFooter>
            <Button>Cadastrar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Voltar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
