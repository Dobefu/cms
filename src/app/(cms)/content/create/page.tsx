import { getContentTypes } from '@/actions/get-content-types'
import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import ReturnLink from '@/components/layout/return-link'
import TitleContainer from '@/components/layout/title-container'
import iconPlus from '@iconify/icons-mdi/plus'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create Content',
}

export default async function CreateContent() {
  const { data, error } = await getContentTypes()

  if (!data || error) {
    notFound()
  }

  return (
    <>
      <ReturnLink href="/content">Back to overview</ReturnLink>

      <Container className="flex flex-col gap-8">
        <TitleContainer>
          <Heading level={1}>Create Content</Heading>
        </TitleContainer>

        <div className="flex flex-col gap-4">
          {data.content_types ? (
            data.content_types.map((contentType) => (
              <Link
                className="btn px-8 py-6"
                href={`/content/create/${contentType.id}`}
                key={contentType.id}
              >
                <Icon className="size-4 shrink-0" icon={iconPlus} ssr />

                {contentType.title}
              </Link>
            ))
          ) : (
            <p>
              There are no content types yet.{' '}
              <Link
                className="font-medium text-blue-600 dark:text-blue-400"
                href="/content-types/create"
              >
                Create one.
              </Link>
            </p>
          )}
        </div>
      </Container>
    </>
  )
}
