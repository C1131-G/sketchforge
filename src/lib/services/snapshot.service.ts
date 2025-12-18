import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import { boardDal } from '@/lib/dal/board.dal'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import { snapshotDal } from '@/lib/dal/snapshot.dal'
import {
  SnapshotCreateSchema,
  SnapshotListByBoardSchema,
  SnapshotFindByIdSchema,
} from '@/lib/schemas/snapshot.schema'
import { RoleType } from '@/prisma/generated/prisma/enums'

export const snapshotService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, kind, snapshotJson } = SnapshotCreateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER) {
        throw ERR.UNAUTHORIZED('Only owner or editor can create snapshots')
      }
    }

    return snapshotDal.create({
      boardId,
      createdBy: userId,
      kind,
      snapshotJson,
    })
  },

  async listByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = SnapshotListByBoardSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return snapshotDal.listByBoard({ boardId })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { snapshotId } = SnapshotFindByIdSchema.parse(input)

    const snapshot = await snapshotDal.findById({ snapshotId })
    if (!snapshot) throw ERR.NOT_FOUND('Snapshot not found')

    const board = await boardDal.findById({
      boardId: snapshot.boardId,
    })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return snapshot
  },
}
