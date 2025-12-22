'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/app-error'

export async function removeBoard(input: unknown) {
  const log = createLogger({ event: 'board', action: 'remove' })
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
