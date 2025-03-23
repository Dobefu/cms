'use client'

import { getContent } from '@/actions/get-content'
import { Content } from '@/types/content'
import iconEdit from '@iconify/icons-mdi/edit'
import iconDelete from '@iconify/icons-mdi/trash'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Client() {
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<Content[] | undefined>(undefined)

  const actionGetContent = async () => {
    setIsLoading(true)
    const { data, error } = await getContent()
    setIsLoading(false)

    if (!data || error) return

    setContent(data?.content)
  }

  // Fetch all content as soon as the page loads.
  useEffect(() => void actionGetContent(), [])

  useEffect(() => {
    /* v8 ignore start */
    if (pathname === '/content') {
      void actionGetContent()
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
        {content && !isLoading ? (
          content.map((contentEntry) => (
            <tr key={contentEntry.id}>
              <td className="py-1 pe-4">{contentEntry.title}</td>
              <td className="py-1 pe-4 text-nowrap max-xl:hidden">
                {new Date(contentEntry.created_at).toLocaleString()}
              </td>
              <td className="py-1 pe-4 text-nowrap max-lg:hidden">
                {new Date(contentEntry.updated_at).toLocaleString()}
              </td>
              <td className="flex gap-2 py-1 max-sm:gap-2">
                <Link className="btn" href={`/content/edit/${contentEntry.id}`}>
                  <Icon className="size-4 shrink-0" icon={iconEdit} ssr />
                  Edit
                </Link>

                <Link
                  className="btn btn--danger"
                  href={`/content/delete/${contentEntry.id}`}
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
              {isLoading ? 'Loading...' : 'There is no content yet'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
