'use server'

import { auth } from '@/core/auth/auth'
import { headers } from 'next/headers'

export async function signOut() {
  return await auth.api.signOut({
    headers: await headers(),
  })
}
