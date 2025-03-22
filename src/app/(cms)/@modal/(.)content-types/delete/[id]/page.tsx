import DeleteContentType from '@/app/(cms)/content-types/delete/[id]/page'
import Modal from '@/components/layout/modal.client'

type Props = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default function DeleteContentTypeModal({ params }: Props) {
  return (
    <Modal>
      <DeleteContentType params={params} isInModal />
    </Modal>
  )
}
