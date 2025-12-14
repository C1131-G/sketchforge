export interface AppLog {
  event: string
  action: string
  status: 'success' | 'failed'
  userId?: string
  meta?: Record<string, unknown>
}
