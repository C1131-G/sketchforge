'use server'

import { withLogContext } from '@/lib/logger/helper'
import { boardService } from '@/lib/services/board.service'
import { AppError } from '@/lib/errors/AppError'

export async function updateBoard(input: unknown) {
  const log = withLogContext({ event: 'board', action: 'update' })
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
