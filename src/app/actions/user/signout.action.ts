'use server'

import { headers } from 'next/headers'
import { AppError } from '@/lib/errors/AppError'
import { authService } from '@/lib/services/auth.service'
import { withLogContext } from '@/lib/logger/helper'

export async function signOut() {
  const log = withLogContext({ event: 'auth', action: 'signout' })
  try {
    const data = await authService.signOut(await headers())
    return { success: true, data }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'SERVER ACTION: Signout server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
