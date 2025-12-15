import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'
import { BoardVisibility } from '@/core/db/generated/prisma/enums'

export const boardDal = {
  create: async (ownerId: string, title: string) => {
    try {
      return await prisma.board.create({
        data: {
          ownerId,
          title,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.create', meta: { ownerId, title } },
        err,
        'Board DAL create crashed',
      )
      return null
    }
  },

  findById: async (boardId: string) => {
    try {
      const board = await prisma.board.findUnique({
        where: {
          id: boardId,
          deletedAt: null,
        },
      })
      if (!board || board.deletedAt) return null

      return board
    } catch (err) {
      logError(
        { event: 'db', action: 'board.findById', meta: { boardId } },
        err,
        'Board DAL findById crashed',
      )
      return null
    }
  },

  listByOwner: async (ownerId: string) => {
    try {
      return await prisma.board.findMany({
        where: {
          ownerId,
          deletedAt: null,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.listByOwner', meta: { ownerId } },
        err,
        'Board DAL listByOwner crashed',
      )
      return null
    }
  },

  update: async (
    boardId: string,
    data: {
      title?: string
      visibility?: BoardVisibility
    },
  ) => {
    try {
      return await prisma.board.update({
        where: { id: boardId },
        data,
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.update', meta: { boardId } },
        err,
        'Board DAL update crashed',
      )
      return null
    }
  },

  remove: async (boardId: string) => {
    try {
      return await prisma.board.update({
        where: {
          id: boardId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.remove', meta: { boardId } },
        err,
        'Board DAL remove crashed',
      )
      return null
    }
  },
}
