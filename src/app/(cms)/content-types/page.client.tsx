'use client'

import { getContentTypes } from '@/actions/get-content-types'
import { ContentType } from '@/types/content-type'
import iconEdit from '@iconify/icons-mdi/edit'
import iconDelete from '@iconify/icons-mdi/trash'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Client() {
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState(true)
  const [contentTypes, setContentTypes] = useState<ContentType[] | undefined>(
    undefined,
  )

  const actionGetContentTypes = async () => {
    setIsLoading(true)
    const { data, error } = await getContentTypes()
    setIsLoading(false)

    if (!data || error) return

    setContentTypes(data?.content_types)
  }

  // Fetch all content types as soon as the page loads.
  useEffect(() => void actionGetContentTypes(), [])

  useEffect(() => {
    /* v8 ignore start */
    if (pathname === '/content-types') {
      void actionGetContentTypes()
    }
    /* v8 ignore stop */
  }, [pathname])

  return (
    <table>
      <thead>
        <tr>
          <th className="w-full py-1 pe-4 text-left">Title</th>
          <th className="py-1 pe-4 text-left text-nowrap max-xl:hidden">
            Created At
          </th>
          <th className="py-1 pe-4 text-left text-nowrap max-lg:hidden">
            Updated At
          </th>
          <th className="py-1 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {contentTypes && !isLoading ? (
          contentTypes.map((contentType) => (
            <tr key={contentType.id}>
              <td
                className="max-w-0 overflow-hidden py-1 pe-4 text-ellipsis whitespace-nowrap"
                title={contentType.title}
              >
                {contentType.title}
              </td>
              <td className="py-1 pe-4 text-nowrap max-xl:hidden">
                {new Date(contentType.created_at).toLocaleString()}
              </td>
              <td className="py-1 pe-4 text-nowrap max-lg:hidden">
                {new Date(contentType.updated_at).toLocaleString()}
              </td>
              <td className="flex gap-2 py-1 max-sm:gap-2">
                <Link
                  className="btn"
                  href={`/content-types/edit/${contentType.id}`}
                >
                  <Icon className="size-4 shrink-0" icon={iconEdit} ssr />
                  Edit
                </Link>

                <Link
                  className="btn btn--danger"
                  href={`/content-types/delete/${contentType.id}`}
                  scroll={false}
                >
                  <Icon className="size-4 shrink-0" icon={iconDelete} ssr />
                  Delete
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-8 py-4 text-center" colSpan={3}>
              {isLoading ? 'Loading...' : 'There are no content types yet'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
