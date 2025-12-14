'use server'

import { auth } from '@/core/auth/auth'
import { headers } from 'next/headers'
import { logError, logSuccess } from '@/lib/logger/helper'

export async function signOut() {
  try {
    const result = await auth.api.signOut({
      headers: await headers(),
    })

    logSuccess({ event: 'auth', action: 'signout' }, 'Signout successful')

    return {
      success: true,
      data: {
        redirect: result.success ?? false,
      },
    }
  } catch (err) {
    logError({ event: 'auth', action: 'signout' }, err, 'Signout crashed')

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}
