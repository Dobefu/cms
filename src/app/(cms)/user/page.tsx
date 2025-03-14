import Heading from '@/components/elements/heading'
import { getUserData } from '@/utils/get-user-data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const { data, error } = await getUserData()

  if (!data || error) {
    return {}
  }

  return {
    title: data.user.username,
  }
}

export default async function User() {
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
