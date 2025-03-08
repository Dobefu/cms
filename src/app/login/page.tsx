import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'

export default function Login() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Container className="max-w-2xl">
        <Heading level={2}>Log in</Heading>
      </Container>
    </div>
  )
}
