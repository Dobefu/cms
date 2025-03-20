'use server'

import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { getQueryClient } from '@/utils/get-query-client'
import { setSessionCookie } from '@/utils/set-session-cookie'
import { validateForm } from '@/utils/validate-form'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

export interface FormState {
  username: string
  errors: {
    username?: string[]
    password?: string[]
    generic?: string[]
  }
}

const LoginSchema = v.object({
  username: v.pipe(
    v.string('The username must be a string'),
    v.nonEmpty('Please enter a username'),
  ),
  password: v.pipe(
    v.string('The password must be a string'),
    v.nonEmpty('Please enter a password'),
  ),
})

export async function login(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const { isValid, newState } = validateForm<typeof LoginSchema, FormState>(
    LoginSchema,
    prevState,
    {
      username,
      password,
    },
  )

  if (!isValid) {
    return newState
  }

  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    return newState
  }

  const apiKey = process.env.API_KEY

  if (!apiKey) {
    return newState
  }

  const queryClient = getQueryClient(0)
  let loginResponse: Response = new Response()
  let isQuerySuccessful

  try {
    loginResponse = await queryClient.fetchQuery({
      queryKey: [apiEndpoint, apiKey, username, password, formData],
      queryFn: async () => {
        const response = await fetch(`${apiEndpoint}/login`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Api-Key': apiKey,
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
    newState.errors.generic = ['Login failed']
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
      await setSessionCookie(loginData.data.token)
    } else {
      newState.errors.generic = ['Login failed']
      return newState
    }

    redirect('/dashboard')
  }

  return newState
}
