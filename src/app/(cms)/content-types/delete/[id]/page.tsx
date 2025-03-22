import Container from '@/components/layout/container'
import { getContentType } from '@/utils/get-content-type'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import DeleteContentTypeClient from './page.client'

type Props = Readonly<{
  isInModal?: boolean
  params: Promise<{
    id: string
  }>
}>

export default async function DeleteContentType({ isInModal, params }: Props) {
  const id = (await params).id

  const { data, error } = await getContentType(+id)

  if (!data || error) {
    notFound()
  }

  const Tag = isInModal ? Fragment : Container

  return (
    <Tag>
      <DeleteContentTypeClient contentType={data.content_type} />
    </Tag>
  )
}
