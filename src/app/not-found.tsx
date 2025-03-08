import Heading from '@/components/elements/heading'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={1}>404</Heading>
      <p>This page could not be found.</p>
    </div>
  )
}
