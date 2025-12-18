import { z } from 'zod'
import { TokenSchema } from '@/lib/schemas/common/token.schema'
import { RoleSchema } from '@/lib/schemas/common/enum.schema'
import { Id } from '@/lib/schemas/common/id.schema'

export const BoardMemberCreateSchema = z.object({
  boardId: Id.board,
  role: RoleSchema,
  targetUserId: Id.user,
})

export const BoardMemberListOfBoardsSchema = z.object({
  boardId: Id.board,
})

export const BoardMemberUpdateSchema = z.object({
  boardId: Id.board,
  targetUserId: Id.user,
  role: RoleSchema,
})

export const BoardMemberRemoveSchema = z.object({
  boardId: Id.board,
  targetUserId: Id.user,
})

export const CreateInviteSchema = z.object({
  boardId: Id.board,
  token: TokenSchema,
  role: RoleSchema.optional(),
})

export const AcceptInviteSchema = z.object({
  token: TokenSchema,
})

export const RevokeInviteSchema = z.object({
  boardId: Id.board,
  token: TokenSchema,
})
