'use server'

import { fetchApiData } from '@/utils/fetch-api-data'
import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { validateForm } from '@/utils/validate-form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

export interface FormState {
  id?: number
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
  const cookieStore = await cookies()
  const token = cookieStore.get('session')

  if (!token) {
    return prevState
  }

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

  const { data, error } = await fetchApiData<{ id: string }>({
    path: prevState.id ? `/content-type/${prevState.id}` : '/content-type',
    method: prevState.id ? 'POST' : 'PUT',
    body: formData,
    queryKeyParts: [title, prevState.id],
  })

  if (error) {
    newState.errors.generic = ['Content type submission failed']
    console.error(`Content type submission failed: ${error.message}`)
    return newState
  }

  if (data?.id) {
    redirect(`/content-types/edit/${data.id}`)
  } else {
    newState.errors.generic = ['Content type submission failed']
    return newState
  }
}
