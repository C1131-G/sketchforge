import { z } from 'zod'
import { TitleSchema } from '@/lib/schemas/common/name.schema'
import { Id, ZIndex } from '@/lib/schemas/common/id.schema'

export const LayerCreateSchema = z.object({
  boardId: Id.board,
  name: TitleSchema,
  zIndex: ZIndex.layer,
})

export const LayerListByBoardSchema = z.object({
  boardId: Id.board,
})

export const LayerFindByIdSchema = z.object({
  layerId: Id.layer,
})

export const LayerUpdateSchema = z
  .object({
    layerId: Id.layer,
    name: TitleSchema.optional(),
    isLocked: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    zIndex: ZIndex.layer.optional(),
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
  layerId: Id.layer,
})
