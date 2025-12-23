'use server'

import { snapshotService } from '@/lib/services/snapshot.service'
import { AppError } from '@/lib/errors/app-error'
import { createLogger } from '@/lib/logger/logger'

export async function createSnapshotAction(input: unknown) {
  const log = createLogger({ event: 'snapshot', action: 'create' })

  try {
    const snapshot = await snapshotService.create(input)
    return { success: true, data: snapshot }
  } catch (err) {
    if (err instanceof AppError) {
      return { success: false, error: err.message }
    }

    log.error(err, 'Create snapshot server action crashed')
    return { success: false, error: 'Something went wrong' }
  }
}
