import { z } from 'zod'
import { Prisma } from '@/prisma/generated/prisma/client'

export const JsonValueSchema = z.custom<Prisma.InputJsonValue>()
