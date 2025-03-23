import Heading from '@/components/elements/heading'
import ContentForm from '@/components/forms/content.client'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import { getContentEntry } from '@/utils/get-content-entry'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Content',
}

type Props = Readonly<{
  params: Promise<{ id: number }>
}>

export default async function EditContentEntry({ params }: Props) {
  const id = (await params).id

  const { data, error } = await getContentEntry(id)

  if (!data || error) {
    notFound()
  }

  return (
    <>
      <ReturnLink href="/content">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>Edit Content</Heading>
        </TitleContainer>

        <ContentForm
          contentId={data.content.id}
          contentType={data.content.content_type}
          initialData={data.content}
        />
      </Container>
    </>
  )
}
