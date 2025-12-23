'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'

export async function acceptBoardInviteAction(input: unknown) {
  const log = createLogger({ event: 'invite', action: 'accept' })
  try {
    await boardMemberService.acceptInvite(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Accept invite server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
