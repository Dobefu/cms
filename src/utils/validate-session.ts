import { fetchApiData } from './fetch-api-data'

const errResponse = { isAnonymous: true }

async function validateSession(refresh: boolean = false): Promise<{
  isAnonymous: boolean
  token?: string
}> {
  const additionalHeaders: Record<string, string> = {}

  if (refresh) {
    additionalHeaders.Refresh = 'true'
  }

  const result = await fetchApiData<{ token: string }>({
    method: 'GET',
    path: '/validate-session',
    additionalHeaders,
    queryKeyParts: [refresh],
  })

  if (result.error) {
    return errResponse
  }

  if (result?.data?.token) {
    return { isAnonymous: false, token: result.data.token }
  } else {
    return errResponse
  }
}

export { validateSession }
