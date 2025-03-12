'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

export function FloatingButton() {
  const [openInputTag, setOpenInputTag] = useState<boolean>(false)

  function handleOpenInputTag() {
    setOpenInputTag(!openInputTag)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-12 w-12 lg:hidden">
          <Plus className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="height-auto">
        <div className="mx-auto w-full max-w-sm overflow-y-auto">
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
                <div className="flex items-center gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="tags"> Etiquetas </Label>
                    <Select name="tags">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Etiquetas</SelectLabel>
                          <SelectItem value="quimica">Química</SelectItem>
                          <SelectItem value="matematica">Matemática</SelectItem>
                          <SelectItem value="historia">História</SelectItem>
                          <SelectItem value="fisica">Física</SelectItem>
                          <SelectItem value="biologia">Biologia</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="items mt-4 flex flex-1 text-center"
                    type="button"
                    onClick={handleOpenInputTag}
                  >
                    {openInputTag ? <Minus /> : <Plus />}
                    <span>Etiqueta</span>
                  </Button>
                </div>
                {openInputTag && (
                  <>
                    <Label htmlFor="tag"> Etiqueta </Label>
                    <Input id="tag" type="text" name="tag" />
                    <Label htmlFor="color"> Cor </Label>
                    <Input
                      id="color"
                      type="color"
                      name="color"
                      defaultValue="#fff"
                      className="h-25 w-25 cursor-pointer rounded-md border-none"
                    />
                  </>
                )}
                <DrawerFooter>
                  <Button type="submit">Cadastrar</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Voltar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
