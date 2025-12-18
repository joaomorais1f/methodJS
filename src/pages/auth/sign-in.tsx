import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInForm = z.object({
  email: z.string().email(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>()

  async function handleSignIn(data: SignInForm) {
    try {
      console.log(data)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success('Enviamos um link de autenticação para seu e-mail.', {
        action: {
          label: 'Reenviar',
          onClick: () => handleSignIn(data),
        },
      })
    } catch {
      toast.error('Credenciais invalidas!')
    }
  }

  return (
    <>
      <Helmet title="Entrar" />
      <div className="p-8">
        <Button asChild variant="ghost" className="absolute top-8 right-8">
          <Link to="/sign-up">Criar conta </Link>
        </Button>
        <div className="flex w-[95%] flex-col md:w-[350px]">
          <header className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {' '}
              Acessar Conta{' '}
            </h1>
            <p className="font-xl text-muted-foreground text-left font-bold">
              Acesse a sua conta para verificar os conteúdos a revisar!
            </p>
          </header>
          <form
            onSubmit={handleSubmit(handleSignIn)}
            className="mt-3 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email"> E-mail </Label>
              <Input type="email" id="email" {...register('email')} />
            </div>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="cursor-pointer"
            >
              Finalizar cadastro
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
