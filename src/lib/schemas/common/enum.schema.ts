import { z } from 'zod'
import { RoleType, ShapeType } from '@/prisma/generated/prisma/enums'

export const RoleSchema = z.enum(RoleType)
export const ShapeSchema = z.enum(ShapeType)
