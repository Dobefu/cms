import Container from '@/components/layout/container'
import { getContentEntry } from '@/utils/get-content-entry'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import DeleteContentEntryClient from './page.client'

type Props = Readonly<{
  params: Promise<{
    id: string
    isInModal?: boolean
  }>
}>

export default async function DeleteContentEntry({ params }: Props) {
  const id = (await params).id
  const isInModal = (await params).isInModal
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
