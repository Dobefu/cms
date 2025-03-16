import Heading from '@/components/elements/heading'
import Container from '@/components/layout/container'
import TitleContainer from '@/components/layout/title-container'
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

  const fields: Record<string, string> = {
    Username: data.user.username,
    Email: data.user.email,
    'Last login': new Date(data.user.last_login).toLocaleString(),
  }

  return (
    <Container className="flex flex-col gap-8">
      <TitleContainer>
        <Heading level={1}>My Account</Heading>
      </TitleContainer>

      <table className="me-auto">
        <tbody>
          {Object.entries(fields).map(([key, value]) => (
            <tr key={key}>
              <td className="p-1 font-medium">{key}:</td>
              <td className="p-1">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  )
}
