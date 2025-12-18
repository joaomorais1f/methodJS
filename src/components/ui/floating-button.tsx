'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { api, type Label } from '@/lib/api'

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
import { Label as FormLabel } from './label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

// Schema de validação para criar conteúdo
const contentSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  labelId: z.string().min(1, 'Selecione uma etiqueta'),
})

// Schema de validação para criar label
const labelSchema = z.object({
  name: z.string().min(1, 'O nome da etiqueta é obrigatório'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
})

type ContentFormData = z.infer<typeof contentSchema>
type LabelFormData = z.infer<typeof labelSchema>

export function FloatingButton() {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openInputTag, setOpenInputTag] = useState(false)
  const [labels, setLabels] = useState<Label[]>([])
  const [isLoadingLabels, setIsLoadingLabels] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form para criar conteúdo
  const {
    register: registerContent,
    handleSubmit: handleSubmitContent,
    formState: { errors: contentErrors },
    reset: resetContent,
    setValue: setContentValue,
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  })

  // Form para criar label
  const {
    register: registerLabel,
    handleSubmit: handleSubmitLabel,
    formState: { errors: labelErrors },
    reset: resetLabel,
    watch: watchLabel,
  } = useForm<LabelFormData>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      color: '#3b82f6', // Azul padrão
    },
  })

  const labelColor = watchLabel('color')

  // Carrega labels ao abrir o drawer
  useEffect(() => {
    if (openDrawer) {
      loadLabels()
    }
  }, [openDrawer])

  async function loadLabels() {
    setIsLoadingLabels(true)
    try {
      const data = await api.getLabels()
      setLabels(data)
    } catch (error) {
      console.error('Erro ao carregar labels:', error)
      toast.error('Erro ao carregar etiquetas')
    } finally {
      setIsLoadingLabels(false)
    }
  }

  function handleOpenInputTag() {
    setOpenInputTag(!openInputTag)
    if (!openInputTag) {
      resetLabel()
    }
  }

  // Submit do conteúdo
  async function onSubmitContent(data: ContentFormData) {
    setIsSubmitting(true)
    try {
      const result = await api.createContent(data.title, Number(data.labelId))

      if (result) {
        toast.success('Conteúdo adicionado com sucesso!', {
          description: `"${result.title}" será revisado amanhã.`,
        })
        resetContent()
        setOpenDrawer(false)
        setOpenInputTag(false)
      } else {
        toast.error('Erro ao adicionar conteúdo')
      }
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error)
      toast.error('Erro ao adicionar conteúdo')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit da label
  async function onSubmitLabel(data: LabelFormData) {
    setIsSubmitting(true)
    try {
      const result = await api.createLabel(data.name, data.color)

      if (result && !('error' in result)) {
        toast.success('Etiqueta criada com sucesso!')
        setLabels((prev) => [...prev, result])
        setContentValue('labelId', String(result.id))
        resetLabel()
        setOpenInputTag(false)
      } else {
        const errorMsg =
          result && typeof result === 'object' && 'error' in result
            ? (result.error as string)
            : 'Erro ao criar etiqueta'
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Erro ao criar label:', error)
      toast.error('Erro ao criar etiqueta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-12 w-12 cursor-pointer">
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
              <form
                onSubmit={handleSubmitContent(onSubmitContent)}
                className="grid w-full gap-3"
              >
                <FormLabel htmlFor="title"> Título do Conteúdo </FormLabel>
                <Input
                  id="title"
                  type="text"
                  placeholder="Ex: Equação do 2º Grau"
                  {...registerContent('title')}
                />
                {contentErrors.title && (
                  <p className="text-sm text-red-500">
                    {contentErrors.title.message}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <FormLabel htmlFor="labelId"> Etiquetas </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        setContentValue('labelId', value)
                      }
                      disabled={isLoadingLabels}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingLabels
                              ? 'Carregando...'
                              : 'Selecione uma etiqueta'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Etiquetas</SelectLabel>
                          {labels.map((label) => (
                            <SelectItem key={label.id} value={String(label.id)}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: label.color }}
                                />
                                {label.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {contentErrors.labelId && (
                      <p className="text-sm text-red-500">
                        {contentErrors.labelId.message}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 flex items-center gap-1"
                    type="button"
                    onClick={handleOpenInputTag}
                  >
                    {openInputTag ? (
                      <Minus className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                    <span>Nova</span>
                  </Button>
                </div>

                {openInputTag && (
                  <div className="space-y-3 rounded-md border p-3">
                    <FormLabel htmlFor="labelName">
                      Nome da Etiqueta
                    </FormLabel>
                    <Input
                      id="labelName"
                      type="text"
                      placeholder="Ex: Matemática"
                      {...registerLabel('name')}
                    />
                    {labelErrors.name && (
                      <p className="text-sm text-red-500">
                        {labelErrors.name.message}
                      </p>
                    )}

                    <FormLabel htmlFor="labelColor"> Cor </FormLabel>
                    <div className="flex items-center gap-3">
                      <Input
                        id="labelColor"
                        type="color"
                        {...registerLabel('color')}
                        className="h-12 w-20 cursor-pointer rounded-md"
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div
                          className="h-6 w-6 rounded-full border-2"
                          style={{ backgroundColor: labelColor }}
                        />
                        <span>{labelColor}</span>
                      </div>
                    </div>
                    {labelErrors.color && (
                      <p className="text-sm text-red-500">
                        {labelErrors.color.message}
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={handleSubmitLabel(onSubmitLabel)}
                      disabled={isSubmitting}
                    >
                      Criar Etiqueta
                    </Button>
                  </div>
                )}

                <DrawerFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
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
