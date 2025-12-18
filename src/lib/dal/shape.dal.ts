import { ShapeType } from '@/prisma/generated/prisma/enums'
import { prisma } from '@/lib/prisma/prisma'
import { Prisma } from '@/prisma/generated/prisma/client'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const shapeDal = {
  create: async (data: {
    boardId: string
    layerId: string
    type: ShapeType
    dataJson: Prisma.InputJsonValue
    styleJson: Prisma.InputJsonValue
    ownerId: string
    zIndex: number
  }) => {
    const log = withLogContext({
      event: 'db',
      action: 'shape.create',
      meta: { boardId: data.boardId },
    })
    try {
      return await prisma.shape.create({
        data: {
          boardId: data.boardId,
          layerId: data.layerId,
          type: data.type,
          dataJson: data.dataJson,
          styleJson: data.styleJson,
          ownerId: data.ownerId,
          zIndex: data.zIndex,
        },
      })
    } catch (err) {
      log.error(err, 'Shape DAL: create failed')
      throw ERR.INTERNAL('Failed to create shape')
    }
  },

  loadByBoard: async (data: { boardId: string }) => {
    const log = withLogContext({
      event: 'db',
      action: 'shape.loadByBoard',
      meta: { boardId: data.boardId },
    })
    try {
      return prisma.shape.findMany({
        where: { boardId: data.boardId },
        orderBy: [
          {
            layerId: 'asc',
          },
          {
            zIndex: 'asc',
          },
        ],
      })
    } catch (err) {
      log.error(err, 'Shape DAL: loadByBoard failed')
      throw ERR.INTERNAL('Failed to load board')
    }
  },
  async findById(data: { shapeId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'shape.findById',
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
      log.error(err, 'Shape DAL: findById failed')
      throw ERR.INTERNAL('Failed to find shape')
    }
  },

  update: async (data: {
    shapeId: string
    dataJson?: Prisma.InputJsonValue
    styleJson?: Prisma.InputJsonValue
    zIndex?: number
    layerId?: string
  }) => {
    const log = withLogContext({
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
      log.error(err, 'Shape DAL: update failed')
      throw ERR.INTERNAL('Failed to update shape')
    }
  },

  remove: async (data: { shapeId: string }) => {
    const log = withLogContext({
      event: 'db',
      action: 'shape.removeShape',
      meta: { shapeId: data.shapeId },
    })
    try {
      return await prisma.shape.update({
        where: { id: data.shapeId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Shape DAL: remove failed')
      throw ERR.INTERNAL('Failed to remove shape')
    }
  },
}
