'use server'

import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  console.log(formData)
  redirect('/user')
}
