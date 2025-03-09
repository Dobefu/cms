import Heading from '@/components/elements/heading'
import LoginForm from '@/components/forms/login.client'
import Container from '@/components/layout/container'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Log in',
}

export default function Login() {
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
