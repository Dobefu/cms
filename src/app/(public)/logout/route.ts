import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { getQueryClient } from '@/utils/get-query-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const queryClient = getQueryClient(0)
  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('session')

  if (!token) {
    redirect('/login')
  }

  try {
    await queryClient.fetchQuery({
      queryKey: [apiEndpoint, token.value],
      queryFn: async () => {
        const response = await fetch(`${apiEndpoint}/logout`, {
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
  } catch (e) {
    console.error(`Logout failed: ${e}`)
  }

  cookieStore.delete('session')

  redirect('/login')
}
