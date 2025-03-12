import Heading from '@/components/elements/heading'
import { getUserData } from '@/utils/get-user-data'
import { validateSession } from '@/utils/validate-session'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My account',
}

export default async function User() {
  const { isAnonymous } = await validateSession()

  if (isAnonymous) {
    redirect('/login')
  }

  const { data, error } = await getUserData()

  if (error) {
    notFound()
  }

  return (
    <div>
      <Heading level={1}>My account</Heading>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
