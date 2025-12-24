'use server'

import { snapshotService } from '@/lib/services/snapshot.service'
import { AppError } from '@/lib/errors/app-error'
import { createLogger } from '@/lib/logger/logger'
import { emitBoardEvent } from '@/lib/ws/emitter'
import { requireSession } from '@/lib/auth/require-session'

export async function createSnapshotAction(input: unknown) {
  const log = createLogger({ event: 'snapshot', action: 'create' })

  try {
    const { id: actorUserId } = await requireSession()
    const snapshot = await snapshotService.create(input)
    emitBoardEvent({
      type: 'snapshot_created',
      boardId: snapshot.boardId,
      entityId: snapshot.id,
      actorUserId,
      timestamp: Date.now(),
    })
    return { success: true, data: snapshot }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create snapshot server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
