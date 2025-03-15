import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import iconPlus from '@iconify/icons-mdi/plus'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Types',
}

export default async function User() {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading level={1}>Content Types</Heading>

        <Link className="btn btn--primary" href="/content-types/create">
          <Icon className="size-4 shrink-0" icon={iconPlus} ssr />
          Create
        </Link>
      </div>
    </Container>
  )
}
