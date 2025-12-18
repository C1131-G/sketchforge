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
        data: {
          ownerId: data.ownerId,
          title: data.title,
        },
      })
    } catch (err) {
      log.error(err, 'Board create failed')
      throw ERR.INTERNAL('Failed to create board')
    }
  },

  async findActiveById(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.findActiveById',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.board.findFirst({
        where: {
          id: data.boardId,
          deletedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'Board find failed')
      throw ERR.INTERNAL('Failed to fetch board')
    }
  },

  async listByOwner(data: { ownerId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.listByOwner',
      meta: { ownerId: data.ownerId },
    })

    try {
      return await prisma.board.findMany({
        where: {
          ownerId: data.ownerId,
          deletedAt: null,
        },
        orderBy: { updatedAt: 'desc' },
      })
    } catch (err) {
      log.error(err, 'Board list failed')
      throw ERR.INTERNAL('Failed to list boards')
    }
  },

  async update(data: {
    boardId: string
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
        where: { id: data.boardId },
        data,
      })
    } catch (err) {
      log.error(err, 'Board update failed')
      throw ERR.INTERNAL('Failed to update board')
    }
  },

  async softDelete(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'board.softDelete',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.board.update({
        where: { id: data.boardId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Board delete failed')
      throw ERR.INTERNAL('Failed to delete board')
    }
  },
}
