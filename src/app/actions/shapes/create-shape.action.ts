'use server'

import { createLogger } from '@/lib/logger/logger'
import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'

export async function createShapeAction(input: unknown) {
  const log = createLogger({ event: 'shape', action: 'create' })

  try {
    const shape = await shapeService.create(input)
    return { success: true, data: shape }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create shape server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
