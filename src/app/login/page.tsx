import Heading from '@/components/elements/heading'
import LoginForm from '@/components/forms/login.client'
import Container from '@/components/layout/container'
import { validateSession } from '@/utils/validate-session'
import { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Log in',
}

export default async function Login() {
  const { isAnonymous } = await validateSession()

  if (!isAnonymous) {
    redirect('/user')
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Container className="flex max-w-xl flex-col gap-8">
        <Heading
          className="flex flex-col items-center justify-center gap-2"
          level={1}
        >
          <Image
            alt=""
            height={48}
            priority
            src="/logo.svg"
            unoptimized
            width={48}
          />
          Log in
        </Heading>

        <LoginForm />
      </Container>
    </div>
  )
}
