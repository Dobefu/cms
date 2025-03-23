import { Content } from '@/types/content'
import { fetchApiData } from './fetch-api-data'

async function getContentEntry(id: number): Promise<{
  data?: { content: Content }
  error?: Error
}> {
  return await fetchApiData<{ content: Content }>({
    method: 'GET',
    path: `/content/${id}`,
    queryKeyParts: [id],
  })
}

export { getContentEntry }
