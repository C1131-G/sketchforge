import { auth } from '@/core/auth/auth'

export type SessionType = (typeof auth.$Infer)['Session']
