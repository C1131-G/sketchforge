import { z } from 'zod'

import { JsonValueSchema } from '@/lib/schemas/common/json.schema'
import { Id } from '@/lib/schemas/common/id.schema'

export const StrokeCreateSchema = z.object({
  boardId: Id.board,
  layerId: Id.layer,
  pointsBlob: z.instanceof(Uint8Array),
  penPropsJson: JsonValueSchema,
})

export const StrokeFindByIdSchema = z.object({
  strokeId: Id.stroke,
})

export const StrokeListByBoardSchema = z.object({
  boardId: Id.board,
})

export const StrokeRemoveSchema = z.object({
  strokeId: Id.stroke,
})
