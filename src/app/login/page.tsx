import { login } from '@/actions/login'
import Heading from '@/components/elements/heading'
import Input from '@/components/form/input'
import Label from '@/components/form/label'
import Container from '@/components/layout/container'
import { Metadata } from 'next'
import Form from 'next/form'

export const metadata: Metadata = {
  title: 'Log in',
}

export default function Login() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Container className="flex max-w-xl flex-col gap-8">
        <Heading className="flex justify-center" level={2}>
          Log in
        </Heading>

        <Form action={login} className="flex flex-col gap-4">
          <Label>
            Username
            <Input name="username" placeholder="Username" />
          </Label>

          <Label>
            Password
            <Input name="password" placeholder="Password" type="password" />
          </Label>

          <Input type="submit" value="Log in" />
        </Form>
      </Container>
    </div>
  )
}
