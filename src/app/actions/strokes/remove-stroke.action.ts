'use server'

import { createLogger } from '@/lib/logger/logger'
import { strokeService } from '@/lib/services/stroke.service'
import { AppError } from '@/lib/errors/app-error'

export async function removeStrokeAction(input: unknown) {
  const log = createLogger({ event: 'stroke', action: 'remove' })

  try {
    await strokeService.remove(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Remove stroke server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
