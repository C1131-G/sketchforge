'use server'

import { boardService } from '@/lib/services/board.service'
import { createLogger } from '@/lib/logger/logger'
import { AppError } from '@/lib/errors/app-error'

export async function createBoard(input: unknown) {
  const log = createLogger({ event: 'board', action: 'create' })

  try {
    const board = await boardService.create(input)

    return { success: true, data: board }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create board server action crashed')

    return { success: false, error: 'Something went wrong' }
  }
}
