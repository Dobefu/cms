import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import TitleContainer from '@/components/layout/title-container'
import iconPlus from '@iconify/icons-mdi/plus'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Metadata } from 'next'
import Link from 'next/link'
import Client from './page.client'

export const metadata: Metadata = {
  title: 'Content Types',
}

export default function ContentTypes() {
  return (
    <Container className="flex flex-col gap-8">
      <TitleContainer>
        <Heading level={1}>Content Types</Heading>

        <Link className="btn btn--primary" href="/content-types/create">
          <Icon className="size-4 shrink-0" icon={iconPlus} ssr />
          Create
        </Link>
      </TitleContainer>

      <Client />
    </Container>
  )
}
