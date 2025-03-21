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
    if (pathname === '/content-types') {
      void actionGetContentTypes()
    }
  }, [pathname])

  return (
    <table>
      <thead>
        <tr>
          <th className="p-1 text-left">ID</th>
          <th className="w-full p-1 text-left">Title</th>
          <th className="p-1 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {contentTypes && !isLoading ? (
          contentTypes.map((contentType) => (
            <tr key={contentType.id}>
              <td className="p-1">{contentType.id}</td>
              <td className="p-1">{contentType.title}</td>
              <td className="flex gap-2 p-1 max-sm:gap-2">
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
            <td className="p-8 text-center" colSpan={3}>
              {isLoading ? 'Loading...' : 'There are no content types yet'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
