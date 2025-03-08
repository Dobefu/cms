'use server'

import { getQueryClient } from '@/utils/get-query-client'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (!username || !password) {
    return
  }

  const apiEndpoint = process.env.API_ENDPOINT

  if (!apiEndpoint) {
    console.error('API_ENDPOINT is not set')
    return
  }

  const queryClient = getQueryClient()
  let isQuerySuccessful

  try {
    await queryClient.fetchQuery({
      queryKey: [apiEndpoint, username, password],
      queryFn: async () => {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        const response = await fetch(`${apiEndpoint}/login`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw `response returned status code ${response.status}`
        }

        return response
      },
    })

    isQuerySuccessful = true
  } catch (e) {
    console.error(`Login failed: ${e}`)
  }

  if (isQuerySuccessful) {
    redirect('/user')
  }
}
