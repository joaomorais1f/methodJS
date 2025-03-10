import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignIn() {
  return (
    <>
      <Helmet title="signIn" />
      <div className="flex w-[95%] flex-col md:w-[350px]">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight"> Acessar Conta </h1>
          <p className="font-xl text-muted-foreground text-left font-bold">
            Acesse a sua conta para verificar os conteúdos a revisar!
          </p>
        </header>
        <form className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email"> E-mail </Label>
            <Input type="email" name="email" id="email" />
          </div>
          <Button type="submit" className="cursor-pointer">
            Acessar plataforma
          </Button>
        </form>
      </div>
    </>
  )
}
