'use server'

import { auth } from '@/core/auth/auth'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger/logger'

export async function signOut() {
  try {
    const result = await auth.api.signOut({
      headers: await headers(),
    })

    return {
      success: true,
      data: {
        redirect: result.success ?? false,
      },
    }
  } catch (err) {
    logger.error(err)

    return {
      success: false,
      error: err instanceof Error ? err.message : 'server error',
    }
  }
}
