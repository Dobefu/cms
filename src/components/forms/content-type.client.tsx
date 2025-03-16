'use client'

import {
  type FormState,
  submitContentType,
} from '@/actions/submit-content-type'
import Input from '@/components/form-elements/input'
import Label from '@/components/form-elements/label'
import Form from 'next/form'
import { useActionState } from 'react'
import FormError from '../form-elements/form-error'

export const initialState: FormState = {
  type: 'create',
  title: '',
  errorTitle: undefined,
  errorGeneric: undefined,
}

export type Props = Readonly<{
  type: 'create' | 'update'
}>

export default function ContentTypeForm({ type }: Props) {
  const [state, formAction, pending] = useActionState(submitContentType, {
    ...initialState,
    type,
  })

  return (
    <Form action={formAction} className="flex flex-col gap-8">
      <Label>
        Title
        <Input
          autoFocus
          data-testid="title"
          defaultValue={state.title}
          name="title"
          placeholder="Title"
          required
          type="text"
        />
        {!!state.errorTitle && <FormError>{state.errorTitle}</FormError>}
      </Label>

      <div className="flex items-center justify-between gap-4">
        <Input
          disabled={pending}
          type="submit"
          value={
            pending
              ? type === 'create'
                ? 'Creating'
                : 'Updating'
              : type === 'create'
                ? 'Create'
                : 'Update'
          }
        />
        {!!state.errorGeneric && <FormError>{state.errorGeneric}</FormError>}
      </div>
    </Form>
  )
}
