import { cookies } from 'next/headers'
import { getApiEndpoint } from './get-api-endpoint'
import { getQueryClient } from './get-query-client'

type ApiRequestOptions = {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  additionalHeaders?: Record<string, string>
  body?: object
  queryKeyParts?: unknown[]
}

async function fetchApiData<T>({
  path,
  method,
  additionalHeaders = {},
  body,
  queryKeyParts = [],
}: ApiRequestOptions): Promise<{
  data?: T
  error?: Error
}> {
  const queryClient = getQueryClient(0)
  let apiResponse: Response = new Response()
  let isQuerySuccessful = false

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
    apiResponse = await queryClient.fetchQuery({
      queryKey: [
        apiEndpoint,
        path,
        method,
        additionalHeaders,
        body,
        token.value,
        ...queryKeyParts,
      ],
      queryFn: async () => {
        const headers: Record<string, string> = {
          'Session-Token': token.value,
          ...additionalHeaders,
        }

        const requestOptions: RequestInit = {
          method,
          headers,
        }

        if (body && (method === 'POST' || method === 'PUT')) {
          requestOptions.body = JSON.stringify(body)
          // Add Content-Type header if not already present
          if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json'
          }
        }

        const response = await fetch(`${apiEndpoint}${path}`, requestOptions)

        if (!response.ok) {
          const errJson = await response.json()

          if (errJson && 'error' in errJson) {
            throw new Error(errJson.error)
          }

          throw new Error(`response returned status code ${response.status}`)
        }

        return response
      },
      staleTime: 0,
      gcTime: 0,
    })

    isQuerySuccessful = true
  } catch (e) {
    console.error(
      `API request to ${path} failed: ${e instanceof Error ? e.message : String(e)}`,
    )
  }

  if (!isQuerySuccessful) {
    return { error: new Error(`API request to ${path} failed`) }
  }

  try {
    const { data } = (await apiResponse.json()) as { data: T }
    return { data }
  } catch (e) {
    return {
      error: new Error(
        `Failed to parse response JSON: ${e instanceof Error ? e.message : String(e)}`,
      ),
    }
  }
}

export { fetchApiData }
