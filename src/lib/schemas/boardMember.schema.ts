import { z } from 'zod'
import { BoardIdSchema, UserIdSchema } from '@/lib/schemas/common/id.schema'
import { RoleType } from '@/prisma/generated/prisma/enums'

const TokenSchema = z
  .string()
  .min(32, 'Invalid invite token')
  .max(128, 'Invalid invite token')
const RoleSchema = z.enum(RoleType)

export const BoardMemberCreateSchema = z.object({
  boardId: BoardIdSchema,
  role: RoleSchema,
  targetUserId: UserIdSchema,
})

export const BoardMemberListOfBoardsSchema = z.object({
  boardId: BoardIdSchema,
})

export const BoardMemberUpdateSchema = z.object({
  boardId: BoardIdSchema,
  targetUserId: UserIdSchema,
  role: RoleSchema,
})

export const BoardMemberRemoveSchema = z.object({
  boardId: BoardIdSchema,
  targetUserId: UserIdSchema,
})

export const CreateInviteSchema = z.object({
  boardId: BoardIdSchema,
  token: TokenSchema,
  role: RoleSchema.optional(),
})

export const AcceptInviteSchema = z.object({
  token: TokenSchema,
})

export const RevokeInviteSchema = z.object({
  boardId: BoardIdSchema,
  token: TokenSchema,
})
