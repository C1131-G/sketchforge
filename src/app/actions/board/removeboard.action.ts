'use server'

import { withLogContext } from '@/lib/logger/helper'
import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/AppError'

export async function removeBoard(input: unknown) {
  const log = withLogContext({ event: 'board', action: 'remove' })
  try {
    await boardService.remove(input)
    return { success: true }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }
    log.error(err, 'Remove board server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
