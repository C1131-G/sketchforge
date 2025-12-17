'use server'

import { redirect } from 'next/navigation'
import { withLogContext } from '@/lib/logger/helper'
import { authService } from '@/lib/services/auth.service'
import { AppError } from '@/lib/errors/AppError'
import { SocialProviderType } from '@/lib/types/social.types'

export async function signInSocial(provider: SocialProviderType) {
  const log = withLogContext({
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

    log.error(err, 'SERVER ACTION: Social signin server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
