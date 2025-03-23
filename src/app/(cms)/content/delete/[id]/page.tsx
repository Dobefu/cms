import Container from '@/components/layout/container'
import { getContentEntry } from '@/utils/get-content-entry'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import DeleteContentEntryClient from './page.client'

type Props = Readonly<{
  isInModal?: boolean
  params: Promise<{
    id: string
  }>
}>

export default async function DeleteContentEntry({ isInModal, params }: Props) {
  const id = (await params).id

  const { data, error } = await getContentEntry(+id)

  if (!data || error) {
    notFound()
  }

  const Tag = isInModal ? Fragment : Container

  return (
    <Tag>
      <DeleteContentEntryClient content={data.content} />
    </Tag>
  )
}
