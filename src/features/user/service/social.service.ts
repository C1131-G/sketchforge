'use server'

import { auth } from '@/core/auth/auth'
import { redirect } from 'next/navigation'
import { logError, logFailed, logSuccess } from '@/lib/logger/helper'

export async function signInSocial(provider: string) {
  try {
    const result = await auth.api.signInSocial({
      body: { provider, callbackURL: '/' },
    })

    if (result.url) {
      logSuccess(
        { event: 'auth', action: 'signin.social', meta: { provider } },
        'Social signin redirect',
      )
      redirect(result.url)
    }

    logFailed(
      { event: 'auth', action: 'signin.social', meta: { provider } },
      'Social signin failed: no redirect URL',
    )

    return {
      success: false,
      error: 'Social sign-in failed.',
    }
  } catch (err) {
    logError(
      { event: 'auth', action: 'signin.social', meta: { provider } },
      err,
      'Social signin crashed',
    )

    return {
      success: false,
      error: 'Social sign-in failed.',
    }
  }
}
