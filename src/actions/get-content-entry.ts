'use server'

import { Content } from '@/types/content'
import { fetchApiData } from '@/utils/fetch-api-data'

async function getContentEntry(): Promise<{
  data?: { content: Content }
  error?: Error
}> {
  return await fetchApiData<{ content: Content }>({
    method: 'GET',
    path: '/content',
  })
}

export { getContentEntry }
