'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'
import { requireSession } from '@/lib/auth/require-session'
import { emitBoardEvent } from '@/lib/ws/emitter'

export async function removeBoardMemberAction(input: unknown) {
  const log = createLogger({ event: 'member', action: 'remove' })
  try {
    const { id: actorUserId } = await requireSession()
    const member = await boardMemberService.remove(input)
    emitBoardEvent({
      type: 'board_member_removed',
      boardId: member.boardId,
      entityId: member.id,
      actorUserId,
      timestamp: Date.now(),
    })
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Remove member server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
