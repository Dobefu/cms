'use server'

import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { getQueryClient } from '@/utils/get-query-client'
import { setSessionCookie } from '@/utils/set-session-cookie'
import { redirect } from 'next/navigation'

export interface FormState {
  type: 'create' | 'update'
  title: string
  errorTitle?: string
  errorGeneric?: string
}

export async function submitContentType(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = formData.get('title') as string

  const { isValid, newState } = validateForm(prevState, title)

  if (!isValid) {
    return newState
  }

  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    return newState
  }

  const queryClient = getQueryClient(0)
  let submitContentTypeResponse: Response = new Response()
  let isQuerySuccessful

  try {
    submitContentTypeResponse = await queryClient.fetchQuery({
      queryKey: [apiEndpoint, title],
      queryFn: async () => {
        const formData = new FormData()
        formData.append('title', title)

        const response = await fetch(`${apiEndpoint}/content-type`, {
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
    newState.errorGeneric = 'Content type submission failed'
    console.error(`Content type submission failed: ${e}`)
  }

  if (isQuerySuccessful) {
    const submitContentTypeData = await submitContentTypeResponse.json()

    if (
      submitContentTypeData &&
      'data' in submitContentTypeData &&
      submitContentTypeData?.data &&
      'token' in submitContentTypeData.data &&
      submitContentTypeData.data?.token
    ) {
      await setSessionCookie(submitContentTypeData.data.token)
    } else {
      newState.errorGeneric = 'Content type submission failed'
      return newState
    }

    redirect('/dashboard')
  }

  return newState
}

function validateForm(
  prevState: FormState,
  title: string,
): { isValid: boolean; newState: FormState } {
  let isValid = true
  const newState = { ...prevState }

  newState.title = title
  newState.errorTitle = undefined
  newState.errorGeneric = undefined

  if (!title) {
    newState.errorTitle = 'Please enter a title'
    isValid = false
  }

  return { isValid, newState }
}
