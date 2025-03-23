import Heading from '@/components/elements/heading'
import ContentForm from '@/components/forms/content.client'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Content',
}

export default function CreateContent() {
  return (
    <>
      <ReturnLink href="/content">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>Create Content</Heading>
        </TitleContainer>

        <ContentForm />
      </Container>
    </>
  )
}
