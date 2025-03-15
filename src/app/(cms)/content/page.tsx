import Heading from '@/components/elements/heading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content',
}

export default async function User() {
  return (
    <div>
      <Heading level={1}>CONTENT</Heading>
    </div>
  )
}
