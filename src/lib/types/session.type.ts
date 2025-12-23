import { auth } from '@/lib/auth/auth'

export type SessionType = (typeof auth.$Infer)['Session']
