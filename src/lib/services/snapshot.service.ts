import { requireSession } from '@/lib/auth/require-session'
import {
  SnapshotCreateSchema,
  SnapshotListByBoardSchema,
  SnapshotFindByIdSchema,
} from '@/lib/schemas/snapshot.schema'
import { snapshotDal } from '@/lib/dal/snapshot.dal'
import { ERR } from '@/lib/errors/error.map'
import {
  requireBoardAccess,
  requireEditorAccess,
} from '@/lib/services/permission.service'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'

export const snapshotService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, kind, snapshotJson } = SnapshotCreateSchema.parse(input)

    await requireEditorAccess(boardId, userId)

    const createSnapshot = await snapshotDal.create({
      boardId,
      createdBy: userId,
      kind,
      snapshotJson,
    })

    revalidateTag(`board:${boardId}:snapshots`, 'max')
    return createSnapshot
  },

  async listByBoard(input: unknown) {
    'use cache'
    const { id: userId } = await requireSession()
    const { boardId } = SnapshotListByBoardSchema.parse(input)

    cacheTag(`board:${boardId}:snapshots`)
    cacheLife('minutes')
    await requireBoardAccess(boardId, userId)
    return snapshotDal.listByBoard({ boardId })
  },

  async findById(input: unknown) {
    'use cache'
    const { id: userId } = await requireSession()
    const { snapshotId } = SnapshotFindByIdSchema.parse(input)
    const snapshot = await snapshotDal.findById({ snapshotId })
    if (!snapshot) throw ERR.NOT_FOUND('Snapshot not found')
    cacheTag(`snapshot:${snapshotId}`)
    cacheLife('minutes')
    await requireBoardAccess(snapshot.boardId, userId)
    return snapshot
  },
}
