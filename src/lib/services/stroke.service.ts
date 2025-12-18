import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import { boardDal } from '@/lib/dal/board.dal'
import { layerDal } from '@/lib/dal/layer.dal'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import { RoleType } from '@/prisma/generated/prisma/enums'
import { strokeDal } from '@/lib/dal/stroke.dal'
import {
  StrokeCreateSchema,
  StrokeFindByIdSchema,
  StrokeListByBoardSchema,
  StrokeRemoveSchema,
} from '@/lib/schemas/stroke.schema'

export const strokeService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, layerId, pointsBlob, penPropsJson } =
      StrokeCreateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    const layer = await layerDal.findById({ layerId })
    if (!layer || layer.boardId !== boardId) {
      throw ERR.NOT_FOUND('Layer not found')
    }

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER) {
        throw ERR.UNAUTHORIZED('Only owner or editor can draw')
      }
    }

    return strokeDal.create({
      boardId,
      layerId,
      ownerId: userId,
      pointsBlob,
      penPropsJson,
    })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeFindByIdSchema.parse(input)

    const stroke = await strokeDal.findById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    const board = await boardDal.findById({ boardId: stroke.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return stroke
  },

  async listByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = StrokeListByBoardSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return strokeDal.listByBoard({ boardId })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeRemoveSchema.parse(input)

    const stroke = await strokeDal.findById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    const board = await boardDal.findById({ boardId: stroke.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER) {
        throw ERR.UNAUTHORIZED('Only owner or editor can remove strokes')
      }
    }

    return strokeDal.remove({ strokeId })
  },
}
