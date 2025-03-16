import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import TitleContainer from '@/components/layout/title-container'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Dashboard() {
  return (
    <Container>
      <TitleContainer>
        <Heading level={1}>DASHBOARD</Heading>
      </TitleContainer>
    </Container>
  )
}
