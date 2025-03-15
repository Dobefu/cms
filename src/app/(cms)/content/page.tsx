import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content',
}

export default async function User() {
  return (
    <Container>
      <Heading level={1}>CONTENT</Heading>
    </Container>
  )
}
