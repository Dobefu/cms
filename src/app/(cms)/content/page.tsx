import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import TitleContainer from '@/components/layout/title-container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content',
}

export default async function Content() {
  return (
    <Container>
      <TitleContainer>
        <Heading level={1}>CONTENT</Heading>
      </TitleContainer>
    </Container>
  )
}
