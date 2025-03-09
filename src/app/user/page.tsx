import Heading from '@/components/elements/heading'
import { validateSession } from '@/utils/validate-session'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My account',
}

export default async function User() {
  const { isAnonymous } = await validateSession()

  if (isAnonymous) {
    redirect('/login')
  }

  return (
    <div>
      <Heading level={1}>My account</Heading>
    </div>
  )
}
