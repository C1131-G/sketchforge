'use server'

import { createLogger } from '@/lib/logger/logger'
import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'

export async function removeShapeAction(input: unknown) {
  const log = createLogger({ event: 'shape', action: 'remove' })

  try {
    await shapeService.remove(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Remove shape server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
