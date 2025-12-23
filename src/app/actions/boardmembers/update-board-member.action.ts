'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'

export async function updateBoardMemberAction(input: unknown) {
  const log = createLogger({ event: 'member', action: 'update' })
  try {
    const member = await boardMemberService.update(input)
    return { success: true, data: member }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'update member server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
