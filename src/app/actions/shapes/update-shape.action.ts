'use server'

import { createLogger } from '@/lib/logger/logger'
import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'

export async function updateShapeAction(input: unknown) {
  const log = createLogger({ event: 'shape', action: 'update' })

  try {
    const shape = await shapeService.update(input)
    return { success: true, data: shape }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Update shape server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
