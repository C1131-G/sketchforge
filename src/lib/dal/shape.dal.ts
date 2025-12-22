import { ShapeType } from '@/prisma/generated/prisma/enums'
import { prisma } from '@/lib/prisma/prisma'
import { Prisma } from '@/prisma/generated/prisma/client'
import { createLogger } from '@/lib/logger/logger'
import { ERR } from '@/lib/errors/error.map'

export const shapeDal = {
  async create(data: {
    boardId: string
    layerId: string
    type: ShapeType
    dataJson: Prisma.InputJsonValue
    styleJson: Prisma.InputJsonValue
    ownerId: string
    zIndex: number
  }) {
    const log = createLogger({
      event: 'db',
      action: 'shape.create',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.shape.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Shape create failed')
      throw ERR.INTERNAL('Failed to create shape')
    }
  },

  async loadByBoard(data: { boardId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'shape.loadByBoard',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.shape.findMany({
        where: {
          boardId: data.boardId,
          deletedAt: null,
        },
        orderBy: [{ layerId: 'asc' }, { zIndex: 'asc' }],
      })
    } catch (err) {
      log.error(err, 'Shape load failed')
      throw ERR.INTERNAL('Failed to load shapes')
    }
  },

  async findActiveById(data: { shapeId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'shape.findActiveById',
      meta: { shapeId: data.shapeId },
    })

    try {
      return await prisma.shape.findFirst({
        where: {
          id: data.shapeId,
          deletedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'Shape find failed')
      throw ERR.INTERNAL('Failed to fetch shape')
    }
  },

  async update(data: {
    shapeId: string
    dataJson?: Prisma.InputJsonValue
    styleJson?: Prisma.InputJsonValue
    zIndex?: number
    layerId?: string
  }) {
    const log = createLogger({
      event: 'db',
      action: 'shape.update',
      meta: { shapeId: data.shapeId },
    })

    try {
      return await prisma.shape.update({
        where: { id: data.shapeId },
        data,
      })
    } catch (err) {
      log.error(err, 'Shape update failed')
      throw ERR.INTERNAL('Failed to update shape')
    }
  },

  async softDelete(data: { shapeId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'shape.softDelete',
      meta: { shapeId: data.shapeId },
    })

    try {
      return await prisma.shape.update({
        where: { id: data.shapeId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Shape delete failed')
      throw ERR.INTERNAL('Failed to delete shape')
    }
  },
}
