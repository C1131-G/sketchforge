import { requireSession } from '@/lib/auth/require-session'
import {
  ShapeCreateSchema,
  ShapeFindByIdSchema,
  ShapeLoadByBoardSchema,
  ShapeRemoveSchema,
  ShapeUpdateSchema,
} from '@/lib/schemas/shape.schema'
import { boardDal } from '@/lib/dal/board.dal'
import { ERR } from '@/lib/errors/error.map'
import { layerDal } from '@/lib/dal/layer.dal'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import { RoleType } from '@/prisma/generated/prisma/enums'
import { shapeDal } from '@/lib/dal/shape.dal'

export const shapeService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, layerId, type, dataJson, styleJson, zIndex } =
      ShapeCreateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    const layer = await layerDal.findById({ layerId })
    if (!layer || layer.boardId !== boardId)
      throw ERR.NOT_FOUND('Layer not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER) {
        throw ERR.UNAUTHORIZED('Only owner or editor can create shapes')
      }
    }

    return shapeDal.create({
      boardId,
      layerId,
      type,
      dataJson,
      styleJson,
      ownerId: userId,
      zIndex,
    })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId } = ShapeFindByIdSchema.parse(input)

    const shape = await shapeDal.findById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    const board = await boardDal.findById({ boardId: shape.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return shape
  },

  async loadByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = ShapeLoadByBoardSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({ boardId, userId })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return shapeDal.loadByBoard({ boardId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId, dataJson, styleJson, zIndex, layerId } =
      ShapeUpdateSchema.parse(input)

    const shape = await shapeDal.findById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    const board = await boardDal.findById({ boardId: shape.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER)
        throw ERR.UNAUTHORIZED('Only owner or editor can update shapes')
    }

    const updateData = {
      ...(dataJson !== undefined && { dataJson }),
      ...(styleJson !== undefined && { styleJson }),
      ...(layerId !== undefined && { layerId }),
      ...(zIndex !== undefined && { zIndex }),
    }

    return await shapeDal.update({
      shapeId,
      ...updateData,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId } = ShapeRemoveSchema.parse(input)

    const shape = await shapeDal.findById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    const board = await boardDal.findById({ boardId: shape.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER)
        throw ERR.UNAUTHORIZED('Only owner or editor can remove shapes')
    }

    return shapeDal.remove({ shapeId })
  },
}
