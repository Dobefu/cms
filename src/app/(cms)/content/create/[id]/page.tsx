import Heading from '@/components/elements/heading'
import ContentForm from '@/components/forms/content.client'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import { getContentType } from '@/utils/get-content-type'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create Content',
}

type Props = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function CreateContent({ params }: Props) {
  const id = (await params).id

  const { data, error } = await getContentType(id)

  if (!data || error) {
    notFound()
  }

  return (
    <>
      <ReturnLink href="/content">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>Create Content</Heading>
        </TitleContainer>

        <ContentForm contentType={data.content_type} />
      </Container>
    </>
  )
}
