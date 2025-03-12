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

  if (!data || error) {
    notFound()
  }

  return (
    <div>
      <Heading level={1}>{data.user.username}</Heading>
    </div>
  )
}
