'use server'

import { authService } from '@/lib/services/auth.service'
import { AppError } from '@/lib/errors/AppError'
import { withLogContext } from '@/lib/logger/helper'

export async function signUp(formData: FormData) {
  const log = withLogContext({ event: 'auth', action: 'signup' })
  try {
    const data = await authService.signUp({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    return { success: true, data }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'SERVER ACTION: Signup server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
