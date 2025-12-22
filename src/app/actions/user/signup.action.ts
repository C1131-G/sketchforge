'use server'

import { authService } from '@/lib/services/auth.service'
import { AppError } from '@/lib/errors/app-error'
import { createLogger } from '@/lib/logger/logger'

export async function signUp(formData: FormData) {
  const log = createLogger({ event: 'auth', action: 'signup' })
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

    log.error(err, 'Signup server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
