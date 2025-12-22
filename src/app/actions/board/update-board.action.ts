'use server'

import { createLogger } from '@/lib/logger/logger'
import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/app-error'

export async function updateBoard(input: unknown) {
  const log = createLogger({ event: 'board', action: 'update' })
  try {
    const board = await boardService.update(input)

    return { success: true, data: board }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Update board server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
