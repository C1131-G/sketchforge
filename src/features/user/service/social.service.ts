'use server'

import { auth } from '@/core/auth/auth'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger/logger'

export async function signInSocial(provider: string) {
  try {
    const result = await auth.api.signInSocial({
      body: { provider, callbackURL: '/' },
    })

    if (result.url) {
      redirect(result.url)
    }

    return {
      success: true,
      data: {
        redirected: !!result.url,
      },
    }
  } catch (err) {
    logger.error({ err }, 'SERVICE signIn social failed')
    return {
      success: false,
      error: err instanceof Error ? err.message : 'server error',
    }
  }
}
