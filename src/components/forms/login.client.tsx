'use client'

import { type FormState, login } from '@/actions/login'
import Input from '@/components/form-elements/input'
import Label from '@/components/form-elements/label'
import Form from 'next/form'
import { useActionState } from 'react'
import FormError from '../form-elements/form-error'

export const initialState: FormState = {
  username: '',
  errorUsername: undefined,
  errorPassword: undefined,
  errorGeneric: undefined,
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <Form action={formAction} className="flex flex-col gap-8">
      <Label>
        Username
        <Input
          autoFocus
          defaultValue={state.username}
          name="username"
          placeholder="Username"
          type="text"
        />
        {!!state.errorUsername && <FormError>{state.errorUsername}</FormError>}
      </Label>

      <Label>
        Password
        <Input
          name="password"
          placeholder="Password"
          required
          type="password"
        />
        {!!state.errorPassword && <FormError>{state.errorPassword}</FormError>}
      </Label>

      <div className="flex items-center justify-between gap-4">
        <Input
          disabled={pending}
          type="submit"
          value={pending ? 'Logging in' : 'Log in'}
        />
        {!!state.errorGeneric && <FormError>{state.errorGeneric}</FormError>}
      </div>
    </Form>
  )
}
