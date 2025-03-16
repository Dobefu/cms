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
  errors: {
    title: undefined,
    generic: undefined,
  },
}

export type Props = Readonly<{
  type: 'create' | 'update'
  initialData?: Omit<FormState, 'type' | 'errors'>
}>

export default function ContentTypeForm({ type, initialData }: Props) {
  const [state, formAction, pending] = useActionState(submitContentType, {
    ...initialState,
    type,
    ...(initialData ?? {}),
  })

  const submitMessages = {
    create: ['Create', 'Creating'],
    update: ['Update', 'Updating'],
  }

  return (
    <Form action={formAction} className="flex flex-col gap-8">
      <Label>
        Title
        <Input
          autoFocus
          data-testid="title"
          /* v8 ignore next */
          defaultValue={state.title ?? initialData?.title}
          name="title"
          placeholder="Title"
          required
          type="text"
        />
        {!!state.errors?.title && <FormError>{state.errors.title}</FormError>}
      </Label>

      <div className="flex items-center justify-between gap-4">
        <Input
          disabled={pending}
          type="submit"
          value={submitMessages[type][+pending]}
        />
        {!!state.errors?.generic && (
          <FormError>{state.errors.generic}</FormError>
        )}
      </div>
    </Form>
  )
}
