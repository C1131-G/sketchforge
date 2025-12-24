'use server'

import { createLogger } from '@/lib/logger/logger'
import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'
import { requireSession } from '@/lib/auth/require-session'
import { emitBoardEvent } from '@/lib/ws/emitter'

export async function updateLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'update' })

  try {
    const { id: actorUserId } = await requireSession()
    const layer = await layerService.update(input)

    emitBoardEvent({
      type: 'layer_updated',
      boardId: layer.boardId,
      entityId: layer.id,
      actorUserId,
      timestamp: Date.now(),
    })
    return { success: true, data: layer }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Update layer server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
