import { logger } from '@/lib/logger/logger'
import { LogContext } from '@/lib/types/logger.types'

export const withLogContext = (ctx: LogContext) => ({
  info(message: string) {
    logger.info(ctx, message)
  },

  warn(message: string) {
    logger.warn(ctx, message)
  },

  error(err: unknown, message: string) {
    logger.error(
      {
        ...ctx,
        err:
          err instanceof Error
            ? { message: err.message, stack: err.stack }
            : err,
      },
      message,
    )
  },
})
