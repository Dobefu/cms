import Container from '@/components/layout/container'
import { getContentType } from '@/utils/get-content-type'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import DeleteContentTypeClient from './page.client'

type Props = Readonly<{
  params: Promise<{
    id: string
    isInModal?: boolean
  }>
}>

export default async function DeleteContentType({ params }: Props) {
  const id = (await params).id
  const isInModal = (await params).isInModal

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
