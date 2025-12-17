import { z } from 'zod'
import { BoardVisibility } from '@/prisma/generated/prisma/enums'
import { BoardIdSchema } from '@/lib/schemas/common/id.schema'

const BoardTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(255, 'Title is too long')

export const BoardCreateSchema = z.object({
  title: BoardTitleSchema,
})

export const BoardFindByIdSchema = z.object({
  boardId: BoardIdSchema,
})

export const BoardUpdateSchema = z
  .object({
    boardId: BoardIdSchema,
    title: BoardTitleSchema.optional(),
    visibility: z.enum(BoardVisibility).optional(),
  })
  .refine((data) => data.title !== undefined || data.visibility !== undefined, {
    message: 'At least one field must be updated',
  })

export const BoardRemoveSchema = z.object({
  boardId: BoardIdSchema,
})
