'use server'

import { fetchApiData } from '@/utils/fetch-api-data'

export async function deleteContentEntry(
  _: unknown,
  formData: FormData,
): Promise<{ success: boolean }> {
  const id = formData.get('id') as string

  const { error } = await fetchApiData<{ id: string }>({
    path: `/content/${id}`,
    method: 'DELETE',
    queryKeyParts: [id],
  })

  if (error) {
    return { success: false }
  }

  return { success: true }
}
