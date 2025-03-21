import Container from '@/components/layout/container'
import { Fragment } from 'react'
import DeleteContentTypeClient from './page.client'

type Props = Readonly<{
  skipContainer?: boolean
  params: Promise<{
    id: string
  }>
}>

export default async function DeleteContentType({
  skipContainer,
  params,
}: Props) {
  const Tag = skipContainer ? Fragment : Container
  const id = (await params).id

  return (
    <Tag>
      <DeleteContentTypeClient id={+id} />
    </Tag>
  )
}
