'use client'

import { deleteContentType } from '@/actions/delete-content-type'
import Heading from '@/components/elements/heading'
import Input from '@/components/form-elements/input'
import { useModal } from '@/hooks/use-modal'
import iconDelete from '@iconify/icons-mdi/trash'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useCallback, useEffect } from 'react'

type Props = Readonly<{
  id: number
}>

export default function DeleteContentTypeClient({ id }: Props) {
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
        Are you sure you want to delete the content type?
      </Heading>

      <Form action={formAction} className="flex flex-col gap-8">
        <Input name="id" type="hidden" value={id} />

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
