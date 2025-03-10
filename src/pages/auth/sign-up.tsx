import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signUpForm = z.object({
  email: z.string().email(),
  name: z.string(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>()

  async function handleSignUp(data: SignUpForm) {
    try {
      console.log(data)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success('Usuário cadastrado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate('/sign-in'),
        },
      })
    } catch {
      toast.error('Erro ao cadastrar usuário!')
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <Button asChild variant="ghost" className="absolute top-8 right-8">
          <Link to="/sign-in">Entrar</Link>
        </Button>
        <div className="flex w-[95%] flex-col md:w-[350px]">
          <header className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {' '}
              Crie uma conta gratuitamente{' '}
            </h1>
            <p className="font-xl text-muted-foreground text-left font-bold">
              Crie uma conta para começar a revisar os seus conteúdos!
            </p>
          </header>
          <form
            onSubmit={handleSubmit(handleSignUp)}
            className="mt-3 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name"> Nome Completo </Label>
              <Input type="text" id="name" {...register('name')} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email"> E-mail </Label>
              <Input type="email" id="email" {...register('email')} />
            </div>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="cursor-pointer"
            >
              Acessar plataforma
            </Button>

            <p className="text-muted-foreground px-6 text-center text-sm leading-relaxed">
              Ao continuar, você concorda com os nossos
              <a href="" className="underline underline-offset-4">
                {' '}
                termos de serviço
              </a>{' '}
              e
              <a href="" className="underline underline-offset-4">
                {' '}
                políticas de privacidade{' '}
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
