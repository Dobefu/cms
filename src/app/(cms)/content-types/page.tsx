import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import { getContentTypes } from '@/utils/get-content-types'
import iconPlus from '@iconify/icons-mdi/plus'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Types',
}

export default async function User() {
  const { data, error } = await getContentTypes()

  return (
    <Container className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Heading level={1}>Content Types</Heading>

        <Link className="btn btn--primary" href="/content-types/create">
          <Icon className="size-4 shrink-0" icon={iconPlus} ssr />
          Create
        </Link>
      </div>

      <table className="me-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {!error && data?.content_types
            ? data.content_types.map((contentType) => (
                <tr key={contentType.id}>
                  <td className="p-1">{contentType.id}</td>
                  <td className="p-1">{contentType.title}</td>
                </tr>
              ))
            : undefined}
        </tbody>
      </table>
    </Container>
  )
}
