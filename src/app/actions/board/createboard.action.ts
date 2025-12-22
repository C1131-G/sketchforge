'use server'

import { boardService } from '@/lib/services/board.service'
import { withLogContext } from '@/lib/logger/helper'
import { AppError } from '@/lib/errors/AppError'

export async function createBoard(input: unknown) {
  const log = withLogContext({ event: 'board', action: 'create' })

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
