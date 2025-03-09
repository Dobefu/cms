'use server'

import { getQueryClient } from '@/utils/get-query-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface FormState {
  username: string
  errorUsername?: string
  errorPassword?: string
  errorGeneric?: string
}

export async function login(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const { isValid, newState } = validateForm(prevState, username, password)

  if (!isValid) {
    return newState
  }

  const apiEndpoint = process.env.API_ENDPOINT

  if (!apiEndpoint) {
    console.error('API_ENDPOINT is not set')
    return newState
  }

  const queryClient = getQueryClient()
  let loginResponse: Response = new Response()
  let isQuerySuccessful

  try {
    loginResponse = await queryClient.fetchQuery({
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
    newState.errorGeneric = 'Login failed'
    console.error(`Login failed: ${e}`)
  }

  if (isQuerySuccessful) {
    const loginData = await loginResponse.json()

    if (
      loginData &&
      'data' in loginData &&
      loginData?.data &&
      'token' in loginData.data &&
      loginData.data?.token
    ) {
      const cookieStore = await cookies()
      cookieStore.set({ name: 'session', value: loginData.data.token })
    } else {
      newState.errorGeneric = 'Login failed'
      return newState
    }

    redirect('/user')
  }

  return newState
}

function validateForm(
  prevState: FormState,
  username: string,
  password: string,
): { isValid: boolean; newState: FormState } {
  let isValid = true
  const newState = { ...prevState }

  newState.username = username
  newState.errorUsername = undefined
  newState.errorPassword = undefined
  newState.errorGeneric = undefined

  if (!username) {
    newState.errorUsername = 'Please enter a username'
    isValid = false
  }

  if (!password) {
    newState.errorPassword = 'Please enter a password'
    isValid = false
  }

  return { isValid, newState }
}
