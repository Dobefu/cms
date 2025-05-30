'use server'

import { type ContentType } from '@/types/content-type'
import { fetchApiData } from '@/utils/fetch-api-data'
import { getApiEndpoint } from '@/utils/get-api-endpoint'
import { validateForm } from '@/utils/validate-form'
import { cookies } from 'next/headers'
import * as v from 'valibot'

export interface FormState {
  id?: number
  content_type?: ContentType
  title: string
  published: boolean
  errors: {
    title?: string[]
    published?: string[]
    generic?: string[]
  }
}

const ContentSchema = v.object({
  title: v.pipe(
    v.string('The title must be a string'),
    v.nonEmpty('Please enter a title'),
    v.minLength(3, 'Please enter a title of at least 3 characters'),
  ),
  published: v.pipe(v.boolean('Published must be a boolean')),
})

export async function submitContent(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')

  if (!token) {
    return prevState
  }

  const contentTypeId = formData.get('content_type') as string
  const title = formData.get('title') as string
  const isPublished = formData.get('published') === 'on'

  const { isValid, newState } = validateForm<typeof ContentSchema, FormState>(
    ContentSchema,
    prevState,
    { content_type: contentTypeId, title, published: isPublished },
  )

  if (!isValid) {
    return newState
  }

  const apiEndpoint = getApiEndpoint()

  if (!apiEndpoint) {
    return newState
  }

  const { data, error } = await fetchApiData<{ id: string }>({
    path: prevState.id ? `/content/${prevState.id}` : '/content',
    method: prevState.id ? 'POST' : 'PUT',
    body: formData,
    queryKeyParts: [title, isPublished, prevState.id],
  })

  if (error) {
    newState.errors.generic = ['Content submission failed']
    console.error(`Content submission failed: ${error.message}`)
    return newState
  }

  if (data?.id) {
    if (!prevState.id) {
      newState.id = +data.id
    }

    return newState
  } else {
    newState.errors.generic = ['Content submission failed']
    return newState
  }
}
