'use client'

import { deleteContentType } from '@/actions/delete-content-type'
import {
  type FormState,
  submitContentType,
} from '@/actions/submit-content-type'
import Input from '@/components/form-elements/input'
import Label from '@/components/form-elements/label'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import { useActionState } from 'react'
import FormError from '../form-elements/form-error'

export const initialState: FormState = {
  title: '',
  errors: {
    title: undefined,
    generic: undefined,
  },
}

export type Props = Readonly<{
  contentTypeId?: number
  initialData?: Omit<FormState, 'errors'>
}>

export default function ContentTypeForm({ contentTypeId, initialData }: Props) {
  const [state, formAction, pending] = useActionState(submitContentType, {
    ...initialState,
    id: contentTypeId,
    ...(initialData ?? {}),
  })

  const submitMessages = [
    ['Create', 'Creating'],
    ['Update', 'Updating'],
  ]

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
          value={submitMessages[+!!contentTypeId][+pending]}
        />
        {!!state.errors?.generic && (
          <FormError>{state.errors.generic}</FormError>
        )}

        {state.id ? (
          <button
            className="btn btn--danger"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={async () => {
              if (!state.id) return

              await deleteContentType(state.id)
              redirect('/content-types')
            }}
          >
            Delete
          </button>
        ) : undefined}
      </div>
    </Form>
  )
}
