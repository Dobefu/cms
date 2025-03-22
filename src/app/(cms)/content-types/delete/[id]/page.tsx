import Container from '@/components/layout/container'
import { Fragment } from 'react'
import DeleteContentTypeClient from './page.client'

type Props = Readonly<{
  isInModal?: boolean
  params: Promise<{
    id: string
  }>
}>

export default async function DeleteContentType({ isInModal, params }: Props) {
  const Tag = isInModal ? Fragment : Container
  const id = (await params).id

  return (
    <Tag>
      <DeleteContentTypeClient id={+id} />
    </Tag>
  )
}
