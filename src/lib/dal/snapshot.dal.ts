import { prisma } from '@/lib/prisma/prisma'
import { SnapshotKind } from '@/prisma/generated/prisma/enums'
import { Prisma } from '@/prisma/generated/prisma/client'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const snapshotDal = {
  async create(data: {
    boardId: string
    createdBy: string
    kind: SnapshotKind
    snapshotJson: Prisma.InputJsonValue
  }) {
    const log = withLogContext({
      event: 'db',
      action: 'snapshot.create',
      meta: { boardId: data.boardId, kind: data.kind },
    })

    try {
      return await prisma.snapshot.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Snapshot DAL: create failed')
      throw ERR.INTERNAL('Failed to create snapshot')
    }
  },

  async listByBoard(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'snapshot.listByBoard',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.snapshot.findMany({
        where: { boardId: data.boardId },
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      log.error(err, 'Snapshot DAL: listByBoard failed')
      throw ERR.INTERNAL('Failed to list snapshots')
    }
  },

  async findById(data: { snapshotId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'snapshot.findById',
      meta: { snapshotId: data.snapshotId },
    })

    try {
      return await prisma.snapshot.findUnique({
        where: { id: data.snapshotId },
      })
    } catch (err) {
      log.error(err, 'Snapshot DAL: findById failed')
      throw ERR.INTERNAL('Failed to find snapshot')
    }
  },
}
