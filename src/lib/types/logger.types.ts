export type LogContext = {
  event: string
  action: string
  userId?: string
  meta?: Record<string, unknown>
}
