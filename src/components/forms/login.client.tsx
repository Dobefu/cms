'use client'

import { type FormState, login } from '@/actions/login'
import Input from '@/components/form-elements/input'
import Label from '@/components/form-elements/label'
import Form from 'next/form'
import { useActionState } from 'react'
import FormError from '../form-elements/form-error'

export const initialState: FormState = {
  username: '',
  errors: {
    username: undefined,
    password: undefined,
    generic: undefined,
  },
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <Form action={formAction} className="flex flex-col gap-8">
      <Label>
        Username
        <Input
          autoFocus
          data-testid="username"
          defaultValue={state.username}
          name="username"
          placeholder="Username"
          required
          type="text"
        />
        {!!state.errors.username && (
          <FormError>{state.errors.username}</FormError>
        )}
      </Label>

      <Label>
        Password
        <Input
          data-testid="password"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
        {!!state.errors.password && (
          <FormError>{state.errors.password}</FormError>
        )}
      </Label>

      <div className="flex items-center justify-between gap-4">
        <Input
          disabled={pending}
          type="submit"
          value={pending ? 'Logging in' : 'Log in'}
        />
        {!!state.errors.generic && (
          <FormError>{state.errors.generic}</FormError>
        )}
      </div>
    </Form>
  )
}
