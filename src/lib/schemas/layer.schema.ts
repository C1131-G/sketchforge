import { z } from 'zod'
import {
  BoardIdSchema,
  LayerIdSchema,
  LayerZIndexSchema,
} from '@/lib/schemas/common/id.schema'
import { TitleSchema } from '@/lib/schemas/common/name.schema'

export const LayerCreateSchema = z.object({
  boardId: BoardIdSchema,
  name: TitleSchema,
  zIndex: LayerZIndexSchema,
})

export const LayerListByBoardSchema = z.object({
  boardId: BoardIdSchema,
})

export const LayerFindByIdSchema = z.object({
  layerId: LayerIdSchema,
})

export const LayerUpdateSchema = z
  .object({
    layerId: LayerIdSchema,
    name: TitleSchema.optional(),
    isLocked: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    zIndex: LayerZIndexSchema.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.isLocked !== undefined ||
      data.isVisible !== undefined ||
      data.zIndex !== undefined,
    {
      message: 'At least one field must be updated',
      path: ['name'],
    },
  )

export const LayerRemoveSchema = z.object({
  layerId: LayerIdSchema,
})
