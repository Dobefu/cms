import Heading from '@/components/elements/heading'
import ContentTypeForm from '@/components/forms/content-type.client'
import Container from '@/components/layout/container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Content Type',
}

export default async function CreateContentType() {
  return (
    <Container className="flex flex-col gap-8">
      <Heading level={1}>Create Content Type</Heading>

      <ContentTypeForm type="create" />
    </Container>
  )
}
