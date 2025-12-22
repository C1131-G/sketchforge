import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import { boardDal } from '@/lib/dal/board.dal'
import {
  BoardCreateSchema,
  BoardFindByIdSchema,
  BoardUpdateSchema,
  BoardRemoveSchema,
} from '@/lib/schemas/board.schema'
import { requireBoard, requireOwner } from '@/lib/services/permission.service'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'

export const boardService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { title } = BoardCreateSchema.parse(input)

    const board = await boardDal.create({
      ownerId: userId,
      title,
    })

    revalidateTag(`user:${userId}:boards`, 'max')
    return board
  },

  async findById(input: unknown) {
    'use cache'
    const { boardId } = BoardFindByIdSchema.parse(input)
    cacheTag(`board:${boardId}`)
    cacheLife('minutes')
    const board = await requireBoard(boardId)

    if (board.visibility !== 'PRIVATE') return board

    const { id: userId } = await requireSession()
    if (board.ownerId !== userId) throw ERR.NOT_FOUND('Board not found')
    return board
  },

  async listOwnerBoards() {
    'use cache'
    const { id: userId } = await requireSession()
    cacheTag(`owner:${userId}:boards`)
    cacheLife('minutes')
    return boardDal.listByOwner({ ownerId: userId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, title, visibility } = BoardUpdateSchema.parse(input)

    await requireOwner(boardId, userId)
    const updateData = {
      ...(title !== undefined && { title }),
      ...(visibility !== undefined && { visibility }),
    }

    const updatedBoard = await boardDal.update({
      boardId,
      ...updateData,
    })
    revalidateTag(`board:${boardId}`, 'max')
    revalidateTag(`owner:${userId}:boards`, 'max')

    return updatedBoard
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = BoardRemoveSchema.parse(input)

    await requireOwner(boardId, userId)
    await boardDal.softDelete({ boardId })

    revalidateTag(`board:${boardId}`, 'max')
    revalidateTag(`owner:${userId}:boards`, 'max')

    return { success: true }
  },
}
