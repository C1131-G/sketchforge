'use server'

import { layerService } from '@/lib/services/layer.service'
import { AppError } from '@/lib/errors/app-error'
import { createLogger } from '@/lib/logger/logger'
import { emitBoardEvent } from '@/lib/ws/emitter'
import { requireSession } from '@/lib/auth/require-session'

export async function createLayerAction(input: unknown) {
  const log = createLogger({ event: 'layer', action: 'create' })
  try {
    const { id: actorUserId } = await requireSession()
    const layer = await layerService.create(input)

    emitBoardEvent({
      type: 'layer_created',
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

    log.error(err, 'Create Layer server action crashed')

    return { success: false, message: 'Something went wrong' }
  }
}
