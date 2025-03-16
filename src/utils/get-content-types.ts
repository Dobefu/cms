import { ContentType } from '@/types/content-type'
import { cookies } from 'next/headers'
import { getApiEndpoint } from './get-api-endpoint'
import { getQueryClient } from './get-query-client'

async function getContentTypes(): Promise<{
  data?: { content_types: ContentType[] }
  error?: Error
}> {
  const queryClient = getQueryClient(0)
  let contentTypesResponse: Response = new Response()
  let isQuerySuccessful

  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    return { error: new Error('API_ENDPOINT is not set') }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('session')

  if (!token) {
    return { error: new Error('No session token cookie') }
  }

  try {
    contentTypesResponse = await queryClient.fetchQuery({
      queryKey: [apiEndpoint, token.value],
      queryFn: async () => {
        const response = await fetch(`${apiEndpoint}/content-types`, {
          method: 'GET',
          headers: {
            'Session-Token': token.value,
          },
        })

        if (!response.ok) {
          const errJson = await response.json()

          if (errJson && 'error' in errJson) {
            throw new Error(errJson.error)
          }

          throw new Error(`response returned status code ${response.status}`)
        }

        return response
      },
    })

    isQuerySuccessful = true
  } catch (e) {
    console.error(`Getting content types failed: ${e}`)
  }

  if (!isQuerySuccessful) {
    return { error: new Error('Getting content types failed') }
  }

  return await contentTypesResponse.json()
}

export { getContentTypes }
