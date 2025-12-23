'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardMemberService } from '@/lib/services/board-member.service'
import { AppError } from '@/lib/errors/app-error'

export async function createBoardInviteAction(input: unknown) {
  const log = createLogger({ event: 'invite', action: 'create' })
  try {
    const invite = await boardMemberService.createInvite(input)
    return { success: true, data: invite }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create invite server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
