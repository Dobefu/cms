import { type UserData } from '@/types/user-data'
import { cookies } from 'next/headers'
import { getApiEndpoint } from './get-api-endpoint'
import { getQueryClient } from './get-query-client'

async function getUserData(): Promise<{
  data?: { user: UserData }
  error?: Error
}> {
  const queryClient = getQueryClient(0)
  let userDataResponse: Response = new Response()
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
    userDataResponse = await queryClient.fetchQuery({
      queryKey: [apiEndpoint, token.value],
      queryFn: async () => {
        const formData = new FormData()
        formData.append('session_token', token.value)

        const response = await fetch(`${apiEndpoint}/get-user-data`, {
          method: 'POST',
          body: formData,
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
    console.error(`Getting user data failed: ${e}`)
  }

  if (!isQuerySuccessful) {
    return { error: new Error('Getting user data failed') }
  }

  return await userDataResponse.json()
}

export { getUserData }
