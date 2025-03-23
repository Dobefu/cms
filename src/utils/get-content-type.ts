import { ContentType } from '@/types/content-type'
import { fetchApiData } from '@/utils/fetch-api-data'

async function getContentType(id: number): Promise<{
  data?: { content_type: ContentType }
  error?: Error
}> {
  return await fetchApiData<{ content_type: ContentType }>({
    method: 'GET',
    path: `/content-type/${id}`,
    queryKeyParts: [id],
  })
}

export { getContentType }
