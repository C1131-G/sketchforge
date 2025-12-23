'use server'

import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'
import { createLogger } from '@/lib/logger/logger'

export async function createLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'create' })
  try {
    const layer = await layerService.create(input)
    return { success: true, data: layer }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, message: err.message }
    }

    log.error(err, 'Create Layer server action crashed')

    return { success: false, message: 'Something went wrong' }
  }
}
