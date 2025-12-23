'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'

export async function removeBoardMemberAction(input: unknown) {
  const log = createLogger({ event: 'member', action: 'remove' })
  try {
    await boardMemberService.remove(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Remove member server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
