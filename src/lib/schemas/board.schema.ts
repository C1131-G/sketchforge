import { z } from 'zod'
import { BoardVisibility } from '@/prisma/generated/prisma/enums'
import { Id } from '@/lib/schemas/common/id.schema'
import { TitleSchema } from '@/lib/schemas/common/name.schema'

export const BoardCreateSchema = z.object({
  title: TitleSchema,
})

export const BoardFindByIdSchema = z.object({
  boardId: Id.board,
})

export const BoardUpdateSchema = z
  .object({
    boardId: Id.board,
    title: TitleSchema.optional(),
    visibility: z.enum(BoardVisibility).optional(),
  })
  .refine((data) => data.title !== undefined || data.visibility !== undefined, {
    message: 'At least one field must be updated',
  })

export const BoardRemoveSchema = z.object({
  boardId: Id.board,
})
