import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'
import { BoardVisibility } from '@/core/db/generated/prisma/enums'

export const boardDal = {
  createBoard: async (ownerId: string, title: string) => {
    try {
      return prisma.board.create({
        data: {
          title,
          ownerId,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.createBoard', meta: { ownerId, title } },
        err,
        'Board dal createBoard' + ' crashed',
      )
      return null
    }
  },

  findBoardById: async (id: string) => {
    try {
      return prisma.board.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.findBoardById', meta: { id } },
        err,
        'Board dal' + ' findBoardById' + ' crashed',
      )
      return null
    }
  },

  listBoardsForOwner: async (ownerId: string) => {
    try {
      return prisma.board.findMany({
        where: {
          ownerId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.listBoardsForOwner', meta: { ownerId } },
        err,
        'Board dal' + ' listBoardsForOwner crashed',
      )
      return null
    }
  },

  updateVisibility: async (id: string, visibility: BoardVisibility) => {
    try {
      return prisma.board.update({
        where: { id },
        data: {
          visibility,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'board.updateVisibility',
          meta: { id, visibility },
        },
        err,
        'Board dal' + ' updateVisibility crashed',
      )
      return null
    }
  },

  softDeleteBoard: async (id: string) => {
    try {
      return prisma.board.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'board.softDeleteBoard', meta: { id } },
        err,
        'Board dal' + ' softDeleteBoard crashed',
      )
      return null
    }
  },
}
