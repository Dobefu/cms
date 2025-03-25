'use client'

import { type FormState, submitContent } from '@/actions/submit-content'
import Input from '@/components/form-elements/input'
import Label from '@/components/form-elements/label'
import { useToast } from '@/hooks/use-toast'
import { type ContentType } from '@/types/content-type'
import iconSave from '@iconify/icons-mdi/floppy'
import iconPlus from '@iconify/icons-mdi/plus'
import iconDelete from '@iconify/icons-mdi/trash'
import { Icon } from '@iconify/react/dist/iconify.js'
import Form from 'next/form'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'
import FormError from '../form-elements/form-error'

export const initialState: FormState = {
  content_type: undefined,
  title: '',
  published: true,
  errors: {
    title: undefined,
    published: undefined,
    generic: undefined,
  },
}

export type Props = Readonly<{
  contentType: ContentType
  contentId?: number
  initialData?: Omit<FormState, 'errors'>
}>

export default function ContentForm({
  contentId,
  contentType,
  initialData,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { success } = useToast()

  const [state, formAction, pending] = useActionState(submitContent, {
    ...initialState,
    id: contentId,
    content_type: contentType,
    ...(initialData ?? {}),
  })

  const prevStateRef = useRef(state)

  /* v8 ignore start */
  useEffect(() => {
    if (
      state !== prevStateRef.current &&
      !state?.errors?.generic &&
      !state?.errors?.title
    ) {
      success(
        `The content has been ${contentId ? 'updated' : 'created'} successfully`,
      )

      if (pathname.includes('create')) {
        router.push(`/content/edit/${state.id}`)
      }
    }

    prevStateRef.current = state
  }, [contentId, contentType.title, state, success, pathname, router])
  /* v8 ignore stop */

  const submitMessages = [
    ['Create', 'Creating'],
    ['Update', 'Updating'],
  ]

  return (
    <Form action={formAction} className="flex flex-col gap-8">
      <Input name="content_type" type="hidden" value={contentType.id} />

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

      <Label className="flex-row">
        <Input
          data-testid="published"
          /* v8 ignore next */
          defaultChecked={state.published ?? initialData?.published ?? true}
          name="published"
          type="checkbox"
        />
        Published
      </Label>
      {!!state.errors?.published && (
        <FormError>{state.errors.published}</FormError>
      )}

      <div className="flex items-center justify-between gap-4">
        <Input
          disabled={pending}
          icon={state.id ? iconSave : iconPlus}
          type="submit"
          value={submitMessages[+!!contentId][+pending]}
        />
        {!!state.errors?.generic && (
          <FormError>{state.errors.generic}</FormError>
        )}

        {state.id ? (
          <Link
            className="btn btn--danger"
            href={`/content/delete/${state.id}`}
            scroll={false}
          >
            <Icon className="size-4 shrink-0" icon={iconDelete} ssr />
            Delete
          </Link>
        ) : undefined}
      </div>
    </Form>
  )
}
