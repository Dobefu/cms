import { type UserData } from '@/types/user-data'
import { fetchApiData } from '@/utils/fetch-api-data'

async function getUserData(): Promise<{
  data?: { user: UserData }
  error?: Error
}> {
  return await fetchApiData<{ user: UserData }>({
    method: 'GET',
    path: '/user-data',
  })
}

export { getUserData }
