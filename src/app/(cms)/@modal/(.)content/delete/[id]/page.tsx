import DeleteContentEntry from '@/app/(cms)/content/delete/[id]/page'
import Modal from '@/components/layout/modal.client'

type Props = Readonly<{
  params: Promise<{
    id: string
    isInModal?: boolean
  }>
}>

export default async function DeleteContentEntryModal({ params }: Props) {
  const awaitedParams = await params
  awaitedParams.isInModal = true

  return (
    <Modal>
      <DeleteContentEntry params={params} />
    </Modal>
  )
}
