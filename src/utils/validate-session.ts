import { cookies } from 'next/headers'
import { getApiEndpoint } from './get-api-endpoint'
import { getQueryClient } from './get-query-client'

const errResponse = { isAnonymous: true }

async function validateSession(): Promise<{ isAnonymous: boolean }> {
  const queryClient = getQueryClient(0)
  let validateResponse: Response = new Response()
  let isQuerySuccessful

  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    return errResponse
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('session')

  if (!token) {
    return errResponse
  }

  try {
    validateResponse = await queryClient.fetchQuery({
      queryKey: [apiEndpoint, token.value],
      queryFn: async () => {
        const formData = new FormData()
        formData.append('session_token', token.value)

        const response = await fetch(`${apiEndpoint}/validate-session`, {
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
    console.error(`Login failed: ${e}`)
  }

  if (!isQuerySuccessful) {
    return { isAnonymous: true }
  }

  const loginData = await validateResponse.json()

  if (
    loginData &&
    'data' in loginData &&
    loginData?.data &&
    'token' in loginData.data &&
    loginData.data?.token
  ) {
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'session',
      value: loginData.data.token,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 86400 * 31,
    })
  } else {
    return errResponse
  }

  return { isAnonymous: false }
}

export { validateSession }
