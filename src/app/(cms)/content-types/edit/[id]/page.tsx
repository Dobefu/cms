import Heading from '@/components/elements/heading'
import ContentTypeForm from '@/components/forms/content-type.client'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import { getContentType } from '@/utils/get-content-type'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Content Type',
}

type Props = Readonly<{
  params: Promise<{ id: number }>
}>

export default async function EditContentType({ params }: Props) {
  const id = (await params).id

  const { data, error } = await getContentType(id)

  if (!data || error) {
    notFound()
  }

  return (
    <>
      <ReturnLink href="/content-types">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>
            Edit Content Type <i>{data.content_type.title}</i>
          </Heading>
        </TitleContainer>

        <ContentTypeForm
          contentTypeId={data.content_type.id}
          initialData={data.content_type}
        />
      </Container>
    </>
  )
}
