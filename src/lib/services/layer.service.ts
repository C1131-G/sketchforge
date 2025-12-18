import { requireSession } from '@/lib/auth/require-session'
import {
  LayerCreateSchema,
  LayerFindByIdSchema,
  LayerListByBoardSchema,
  LayerRemoveSchema,
  LayerUpdateSchema,
} from '@/lib/schemas/layer.schema'
import { boardDal } from '@/lib/dal/board.dal'
import { ERR } from '@/lib/errors/error.map'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import { RoleType } from '@/prisma/generated/prisma/enums'
import { layerDal } from '@/lib/dal/layer.dal'

export const LayerService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, name, zIndex } = LayerCreateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role !== RoleType.EDITOR)
        throw ERR.UNAUTHORIZED('Only owner or editor can create layers')
    }

    return layerDal.create({
      boardId,
      name,
      zIndex,
    })
  },

  async listByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = LayerListByBoardSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
    }
    return await layerDal.listByBoard({ boardId })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId } = LayerFindByIdSchema.parse(input)

    const layer = await layerDal.findById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    const board = await boardDal.findById({ boardId: layer.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })

      if (!member) throw ERR.NOT_FOUND('Board not found')
    }

    return layer
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId, name, isLocked, isVisible, zIndex } =
      LayerUpdateSchema.parse(input)

    const layer = await layerDal.findById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    const board = await boardDal.findById({ boardId: layer.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER)
        throw ERR.UNAUTHORIZED('Only owner or editor can update layers')
    }

    const updateData = {
      ...(name !== undefined && { name }),
      ...(isLocked !== undefined && { isLocked }),
      ...(isVisible !== undefined && { isVisible }),
      ...(zIndex !== undefined && { zIndex }),
    }

    await layerDal.update({
      layerId,
      ...updateData,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId } = LayerRemoveSchema.parse(input)

    const layer = await layerDal.findById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    const board = await boardDal.findById({ boardId: layer.boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        boardId: board.id,
        userId,
      })
      if (!member) throw ERR.NOT_FOUND('Board not found')
      if (member.role === RoleType.VIEWER)
        throw ERR.UNAUTHORIZED('Only owner or editor can create layers')
    }

    return await layerDal.remove({ layerId })
  },
}
