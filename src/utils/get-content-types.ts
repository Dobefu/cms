import { ContentType } from '@/types/content-type'
import { fetchApiData } from './fetch-api-data'

async function getContentTypes(): Promise<{
  data?: { content_types: ContentType[] }
  error?: Error
}> {
  return await fetchApiData<{ content_types: ContentType[] }>({
    method: 'GET',
    path: '/content-types',
  })
}

export { getContentTypes }
