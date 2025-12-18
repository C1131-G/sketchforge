import { z } from 'zod'
import { ShapeSchema } from '@/lib/schemas/common/enum.schema'
import { JsonValueSchema } from '@/lib/schemas/common/json.schema'
import { Id, ZIndex } from '@/lib/schemas/common/id.schema'

export const ShapeCreateSchema = z.object({
  boardId: Id.board,
  layerId: Id.layer,
  type: ShapeSchema,
  dataJson: JsonValueSchema,
  styleJson: JsonValueSchema,
  zIndex: ZIndex.shape,
})

export const ShapeLoadByBoardSchema = z.object({
  boardId: Id.board,
})

export const ShapeFindByIdSchema = z.object({
  shapeId: Id.shape,
})

export const ShapeUpdateSchema = z
  .object({
    shapeId: Id.shape,
    dataJson: JsonValueSchema.optional(),
    styleJson: JsonValueSchema.optional(),
    zIndex: ZIndex.shape.optional(),
    layerId: Id.layer.optional(),
  })
  .refine(
    (data) =>
      data.dataJson !== undefined ||
      data.styleJson !== undefined ||
      data.zIndex !== undefined ||
      data.layerId !== undefined,
    {
      message: 'At least one field must be updated',
      path: ['dataJson'],
    },
  )

export const ShapeRemoveSchema = z.object({
  shapeId: Id.shape,
})
