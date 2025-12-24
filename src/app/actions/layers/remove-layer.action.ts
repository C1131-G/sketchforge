'use server'

import { createLogger } from '@/lib/logger/logger'
import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'
import { requireSession } from '@/lib/auth/require-session'
import { emitBoardEvent } from '@/lib/ws/emitter'

export async function removeLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'remove' })
  try {
    const { id: actorUserId } = await requireSession()

    const layer = await layerService.remove(input)

    emitBoardEvent({
      type: 'layer_removed',
      boardId: layer.boardId,
      entityId: layer.id,
      actorUserId,
      timestamp: Date.now(),
    })

    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Remove layer server action crashed')

    return { success: false, message: 'Something went wrong' }
  }
}
