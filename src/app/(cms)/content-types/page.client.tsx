'use client'

import { deleteContentType } from '@/actions/delete-content-type'
import { ContentType } from '@/types/content-type'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export type Props = Readonly<{
  contentTypes?: ContentType[]
}>

export default function Client({ contentTypes }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th className="text-left">ID</th>
          <th className="text-left">Title</th>
          <th className="text-left"></th>
        </tr>
      </thead>
      <tbody>
        {contentTypes ? (
          contentTypes.map((contentType) => (
            <tr key={contentType.id}>
              <td className="p-1">{contentType.id}</td>
              <td className="w-full p-1">{contentType.title}</td>
              <td className="flex gap-1 p-1">
                <Link
                  className="btn"
                  href={`/content-types/edit/${contentType.id}`}
                >
                  Edit
                </Link>

                <button
                  className="btn btn--danger"
                  /* v8 ignore start */
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={async () => {
                    await deleteContentType(contentType.id)
                    redirect('')
                  }}
                  /* v8 ignore stop */
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-8 text-center" colSpan={3}>
              There are no content types yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
