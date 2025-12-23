'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'
import { emitBoardEvent } from '@/lib/ws/emitter'
import { requireSession } from '@/lib/auth/require-session'

export async function createBoardMemberAction(input: unknown) {
  const log = createLogger({ event: 'member', action: 'create' })
  try {
    const { id: actorUserId } = await requireSession()
    const member = await boardMemberService.create(input)

    emitBoardEvent({
      type: 'board_member_created',
      boardId: member.boardId,
      entityId: member.id,
      actorUserId,
      timestamp: Date.now(),
    })

    return { success: true, data: member }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create member server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
