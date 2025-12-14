import { logger } from '@/lib/logger/logger'
import { AppLog } from '@/lib/logger/logger.types'

export function logInfo(log: Omit<AppLog, 'status'>, message: string) {
  logger.info({ ...log, status: 'info' }, message)
}

export function logSuccess(log: Omit<AppLog, 'status'>, message: string) {
  logger.info({ ...log, status: 'success' }, message)
}

export function logFailed(log: Omit<AppLog, 'status'>, message: string) {
  logger.info({ ...log, status: 'failed' }, message)
}

export function logError(
  log: Omit<AppLog, 'status'>,
  err: unknown,
  message: string,
) {
  logger.error({ ...log, status: 'failed', err }, message)
}
