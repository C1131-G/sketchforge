import { z } from 'zod'

import { JsonValueSchema } from '@/lib/schemas/common/json.schema'
import { SnapshotKindSchema } from '@/lib/schemas/common/enum.schema'
import { Id } from '@/lib/schemas/common/id.schema'

export const SnapshotCreateSchema = z.object({
  boardId: Id.board,
  kind: SnapshotKindSchema,
  snapshotJson: JsonValueSchema,
})

export const SnapshotListByBoardSchema = z.object({
  boardId: Id.board,
})

export const SnapshotFindByIdSchema = z.object({
  snapshotId: Id.snapshot,
})
