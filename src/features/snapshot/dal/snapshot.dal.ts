import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'
import { SnapshotKind } from '@/core/db/generated/prisma/enums'
import { Prisma } from '@/core/db/generated/prisma/client'

export const snapshotDal = {
  create: async (
    boardId: string,
    createdBy: string,
    kind: SnapshotKind,
    snapshotJson: Prisma.InputJsonValue,
  ) => {
    try {
      return await prisma.snapshot.create({
        data: {
          boardId,
          createdBy,
          kind,
          snapshotJson,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'snapshot.create',
          meta: { boardId, createdBy, kind },
        },
        err,
        'Snapshot DAL create crashed',
      )
      return null
    }
  },

  listByBoard: async (boardId: string) => {
    try {
      return await prisma.snapshot.findMany({
        where: { boardId },
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'snapshot.listByBoard', meta: { boardId } },
        err,
        'Snapshot DAL listByBoard crashed',
      )
      return null
    }
  },

  findById: async (snapshotId: string) => {
    try {
      return await prisma.snapshot.findUnique({
        where: { id: snapshotId },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'snapshot.findById', meta: { snapshotId } },
        err,
        'Snapshot DAL findById crashed',
      )
      return null
    }
  },
}
