import { prisma } from '@/lib/prisma/prisma'
import { BoardVisibility } from '@/prisma/generated/prisma/enums'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const boardDal = {
  async create(data: { ownerId: string; title: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.create',
      meta: { ownerId: data.ownerId },
    })
    try {
      return await prisma.board.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Board DAL: create failed')
      throw ERR.INTERNAL('Failed to create board')
    }
  },

  async findById(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.findById',
      meta: { boardId: data.boardId },
    })
    try {
      return await prisma.board.findUnique({
        where: { id: data.boardId, deletedAt: null },
      })
    } catch (err) {
      log.error(err, 'Board DAL: findById failed')
      throw ERR.INTERNAL('Failed to fetch board')
    }
  },

  async listOwnerBoards(data: { ownerId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.listOwnerBoards',
      meta: { ownerId: data.ownerId },
    })
    try {
      return await prisma.board.findMany({
        where: {
          ownerId: data.ownerId,
          deletedAt: null,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
    } catch (err) {
      log.error(err, 'Board DAL:listOwnerBoards failed')
      throw ERR.INTERNAL('Failed to list boards')
    }
  },

  async update(data: {
    boardId: string
    ownerId: string
    title?: string
    visibility?: BoardVisibility
  }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.update',
      meta: { boardId: data.boardId },
    })
    try {
      return await prisma.board.update({
        where: {
          board_owner_unique: {
            id: data.boardId,
            ownerId: data.ownerId,
          },
        },
        data,
      })
    } catch (err) {
      log.error(err, 'Board DAL:update failed')
      throw ERR.INTERNAL('Failed to update board')
    }
  },

  async remove(data: { boardId: string; ownerId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.remove',
      meta: { boardId: data.boardId },
    })
    try {
      return await prisma.board.update({
        where: {
          board_owner_unique: {
            id: data.boardId,
            ownerId: data.ownerId,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      })
    } catch (err) {
      log.error(err, 'Board DAL:remove failed')
      throw ERR.INTERNAL('Failed to delete board')
    }
  },
}
