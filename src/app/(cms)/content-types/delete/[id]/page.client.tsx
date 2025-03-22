'use client'

import { deleteContentType } from '@/actions/delete-content-type'
import Heading from '@/components/elements/heading'
import Input from '@/components/form-elements/input'
import { useModal } from '@/hooks/use-modal'
import { type ContentType } from '@/types/content-type'
import iconDelete from '@iconify/icons-mdi/trash'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect } from 'react'

type Props = Readonly<{
  contentType: ContentType
}>

export default function DeleteContentTypeClient({ contentType }: Props) {
  const { closeModal } = useModal()
  const router = useRouter()

  const [state, formAction, pending] = useActionState(
    deleteContentType,
    undefined,
  )

  useEffect(() => {
    /* v8 ignore start */
    if (state?.success) {
      closeModal(() => {
        router.push('/content-types')
      })
    }
    /* v8 ignore stop */
  }, [state, closeModal, router])

  const handleCancel = useCallback(() => {
    /* v8 ignore start */
    closeModal()
    /* v8 ignore stop */
  }, [closeModal])

  return (
    <div className="flex flex-col gap-8">
      <Heading level={1}>
        Are you sure you want to delete
        <i className="text-nowrap">&quot;{contentType.title}&quot;</i>?
      </Heading>

      <div className="flex flex-col gap-4">
        <p>
          Deleting the content type will also delete any content that uses this
          content type.
        </p>

        <b>This action cannot be undone!</b>
      </div>

      <Form action={formAction} className="flex flex-col gap-8">
        <Input name="id" type="hidden" value={contentType.id} />

        <div className="flex justify-between">
          <Input
            className="btn--danger"
            disabled={pending}
            icon={iconDelete}
            type="submit"
            value="Delete"
          />

          <Input
            disabled={pending}
            onClick={handleCancel}
            type="button"
            value="Cancel"
          />
        </div>
      </Form>
    </div>
  )
}
