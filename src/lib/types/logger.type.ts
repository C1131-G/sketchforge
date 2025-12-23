export type LogContextType = {
  event: string
  action: string
  userId?: string
  meta?: Record<string, unknown>
}
