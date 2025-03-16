'use server'

import { fetchApiData } from '@/utils/fetch-api-data'

export async function deleteContentType(
  id: number,
): Promise<{ success: boolean }> {
  const { error } = await fetchApiData<{ id: string }>({
    path: `/content-type/${id}`,
    method: 'DELETE',
    queryKeyParts: [id],
  })

  if (error) {
    return { success: false }
  }

  return { success: true }
}
