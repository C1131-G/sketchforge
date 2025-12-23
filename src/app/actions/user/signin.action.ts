'use server'

import { authService } from '@/lib/services/auth.service'
import { createLogger } from '@/lib/logger/logger'
import { AppError } from '@/lib/errors/app-error'

export async function signInAction(formData: FormData) {
  const log = createLogger({ event: 'auth', action: 'signin' })
  try {
    const data = await authService.signIn({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    return { success: true, data }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Signin server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
