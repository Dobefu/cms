'use server'

import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { getQueryClient } from '@/utils/get-query-client'
import { setSessionCookie } from '@/utils/set-session-cookie'
import { validateForm } from '@/utils/validate-form'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

export interface FormState {
  type: 'create' | 'update'
  title: string
  errors: {
    title?: string[]
    generic?: string[]
  }
}

const ContentTypeSchema = v.object({
  title: v.pipe(
    v.string('The title must be a string'),
    v.nonEmpty('Please enter a title'),
    v.minLength(3, 'Please enter a title of at least 3 characters'),
  ),
})

export async function submitContentType(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = formData.get('title') as string

  const { isValid, newState } = validateForm<
    typeof ContentTypeSchema,
    FormState
  >(ContentTypeSchema, prevState, { title })

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
      queryKey: [apiEndpoint, title, prevState.type],
      queryFn: async () => {
        const formData = new FormData()
        formData.append('title', title)

        const response = await fetch(`${apiEndpoint}/content-type`, {
          method: prevState.type === 'create' ? 'PUT' : 'POST',
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
    newState.errors.generic = ['Content type submission failed']
    console.error(`Content type submission failed: ${e}`)
  }

  if (isQuerySuccessful) {
    const submitContentTypeData = await submitContentTypeResponse.json()

    if (
      submitContentTypeData &&
      'data' in submitContentTypeData &&
      submitContentTypeData?.data &&
      'id' in submitContentTypeData.data &&
      submitContentTypeData.data?.id
    ) {
      redirect(`/content-types/edit/${submitContentTypeData.data.id}`)
    } else {
      newState.errors.generic = ['Content type submission failed']
      return newState
    }
  }

  return newState
}
