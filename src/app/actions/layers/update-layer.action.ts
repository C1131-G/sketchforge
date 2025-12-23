'use server'

import { createLogger } from '@/lib/logger/logger'
import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'

export async function updateLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'update' })

  try {
    const layer = await layerService.update(input)
    return { success: true, data: layer }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Update layer server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
