import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'
import { BoardVisibility } from '@/core/db/generated/prisma/enums'

export const boardDal = {
  createBoard: async (ownerId: string, title: string) => {
    try {
      return await prisma.board.create({
        data: {
          ownerId,
          title,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.createBoard', meta: { ownerId, title } },
        err,
        'Board DAL createBoard crashed',
      )
      return null
    }
  },

  findBoardById: async (boardId: string) => {
    try {
      return await prisma.board.findFirst({
        where: {
          id: boardId,
          deletedAt: null,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.findBoardById', meta: { boardId } },
        err,
        'Board DAL findBoardById crashed',
      )
      return null
    }
  },

  listBoardsForOwner: async (ownerId: string) => {
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
        { event: 'db', action: 'board.listBoardsForOwner', meta: { ownerId } },
        err,
        'Board DAL listBoardsForOwner crashed',
      )
      return null
    }
  },

  renameBoard: async (boardId: string, title: string) => {
    try {
      return await prisma.board.update({
        where: { id: boardId },
        data: { title },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.renameBoard', meta: { boardId, title } },
        err,
        'Board DAL renameBoard crashed',
      )
      return null
    }
  },

  updateVisibility: async (boardId: string, visibility: BoardVisibility) => {
    try {
      return await prisma.board.update({
        where: { id: boardId },
        data: { visibility },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'board.updateVisibility',
          meta: { boardId, visibility },
        },
        err,
        'Board DAL updateVisibility crashed',
      )
      return null
    }
  },

  softDeleteBoard: async (boardId: string) => {
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
        { event: 'db', action: 'board.softDeleteBoard', meta: { boardId } },
        err,
        'Board DAL softDeleteBoard crashed',
      )
      return null
    }
  },
}
