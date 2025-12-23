'use server'

import { createLogger } from '@/lib/logger/logger'
import { strokeService } from '@/lib/services/stroke.service'
import { AppError } from '@/lib/errors/app-error'

export async function createStrokeAction(input: unknown) {
  const log = createLogger({ event: 'stroke', action: 'create' })

  try {
    const stroke = await strokeService.create(input)
    return { success: true, data: stroke }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create stroke server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
