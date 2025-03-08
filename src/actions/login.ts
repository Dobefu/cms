'use server'

import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (!username || !password) {
    return
  }

  redirect('/user')
}
