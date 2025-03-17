import Heading from '@/components/elements/heading'
import ContentTypeForm from '@/components/forms/content-type.client'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Content Type',
}

export default async function CreateContentType() {
  return (
    <>
      <ReturnLink href="/content-types">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>Create Content Type</Heading>
        </TitleContainer>

        <ContentTypeForm />
      </Container>
    </>
  )
}
