'use server'

import { redirect } from 'next/navigation'
import { createLogger } from '@/lib/logger/logger'
import { authService } from '@/lib/services/auth.service'
import { AppError } from '@/lib/errors/app-error'
import { SocialProviderType } from '@/lib/types/social.types'

export async function signInSocialAction(provider: SocialProviderType) {
  const log = createLogger({
    event: 'auth',
    action: 'signin.social',
    meta: { provider },
  })
  try {
    const url = await authService.signInSocial(provider)
    redirect(url)
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Social signin server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
