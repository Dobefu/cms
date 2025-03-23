import DeleteContentType from '@/app/(cms)/content-types/delete/[id]/page'
import Modal from '@/components/layout/modal.client'

type Props = Readonly<{
  params: Promise<{
    id: string
    isInModal?: boolean
  }>
}>

export default async function DeleteContentTypeModal({ params }: Props) {
  const awaitedParams = await params
  awaitedParams.isInModal = true

  return (
    <Modal>
      <DeleteContentType params={Promise.resolve(awaitedParams)} />
    </Modal>
  )
}
