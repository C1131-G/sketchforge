'use server'

import { authService } from '@/lib/services/auth.service'
import { withLogContext } from '@/lib/logger/helper'
import { AppError } from '@/lib/errors/AppError'

export async function signIn(fromData: FormData) {
  const log = withLogContext({ event: 'auth', action: 'signin' })
  try {
    const data = await authService.signIn({
      email: fromData.get('email'),
      password: fromData.get('password'),
    })

    return { success: true, data }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'SERVER ACTION: Signin server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
