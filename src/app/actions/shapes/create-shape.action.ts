'use server'

import { createLogger } from '@/lib/logger/logger'
import { shapeService } from '@/lib/services/shape.service'
import { AppError } from '@/lib/errors/app-error'
import { emitBoardEvent } from '@/lib/ws/emitter'
import { requireSession } from '@/lib/auth/require-session'

export async function createShapeAction(input: unknown) {
  const log = createLogger({ event: 'shape', action: 'create' })

  try {
    const { id: actorUserId } = await requireSession()
    const shape = await shapeService.create(input)

    emitBoardEvent({
      type: 'shape_created',
      boardId: shape.boardId,
      entityId: shape.id,
      actorUserId,
      timestamp: Date.now(),
    })
    return { success: true, data: shape }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create shape server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
