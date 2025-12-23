'use server'

import { createLogger } from '@/lib/logger/logger'
import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'

export async function removeLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'remove' })
  try {
    await layerService.remove(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, message: err.message }
    }

    log.error(err, 'Remove layer server action crashed')

    return { success: false, message: 'Something went wrong' }
  }
}
