import pino from 'pino'

const isDev = process.env.APP_ENV !== 'production'

export const logger = pino({
  level: 'info',
  ...(isDev && {
    transport: { target: 'pino-pretty' },
  }),
})
