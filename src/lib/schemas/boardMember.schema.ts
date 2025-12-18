import { z } from 'zod'
import {
  BoardIdSchema,
  TargetUserIdSchema,
} from '@/lib/schemas/common/id.schema'
import { TokenSchema } from '@/lib/schemas/common/token.schema'
import { RoleSchema } from '@/lib/schemas/common/enum.schema'

export const BoardMemberCreateSchema = z.object({
  boardId: BoardIdSchema,
  role: RoleSchema,
  targetUserId: TargetUserIdSchema,
})

export const BoardMemberListOfBoardsSchema = z.object({
  boardId: BoardIdSchema,
})

export const BoardMemberUpdateSchema = z.object({
  boardId: BoardIdSchema,
  targetUserId: TargetUserIdSchema,
  role: RoleSchema,
})

export const BoardMemberRemoveSchema = z.object({
  boardId: BoardIdSchema,
  targetUserId: TargetUserIdSchema,
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
