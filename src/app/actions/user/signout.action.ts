'use server'

import { headers } from 'next/headers'
import { AppError } from '@/lib/errors/app-error'
import { authService } from '@/lib/services/auth.service'
import { createLogger } from '@/lib/logger/logger'

export async function signOutAction() {
  const log = createLogger({ event: 'auth', action: 'signout' })
  try {
    const data = await authService.signOut(await headers())
    return { success: true, data }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Signout server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
