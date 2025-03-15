import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Content Type',
}

export default async function CreateContentType() {
  return (
    <Container>
      <Heading level={1}>CREATE CONTENT TYPE</Heading>
    </Container>
  )
}
