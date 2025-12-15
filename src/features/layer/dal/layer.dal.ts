import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'

export const layerDal = {
  createLayer: async (boardId: string, name: string, zIndex: number) => {
    try {
      return await prisma.layer.create({
        data: {
          boardId,
          name,
          zIndex,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'layer.createLayer',
          meta: { boardId, name, zIndex },
        },
        err,
        'Layer DAL' + ' createLayer' + ' crashed',
      )
      return null
    }
  },

  listLayers: async (boardId: string) => {
    try {
      return await prisma.layer.findMany({
        where: { boardId, deletedAt: null },
        orderBy: { zIndex: 'asc' },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'layer.listLayers', meta: { boardId } },
        err,
        'Layer DAL listLayers' + ' crashed',
      )
      return null
    }
  },

  findLayerById: async (layerId: string) => {
    try {
      return await prisma.layer.findFirst({
        where: {
          id: layerId,
          deletedAt: null,
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'layer.findLayerById', meta: { layerId } },
        err,
        'Layer DAL findLayerById crashed',
      )
      return null
    }
  },

  renameLayer: async (layerId: string, name: string) => {
    try {
      return await prisma.layer.update({
        where: { id: layerId },
        data: { name },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'layer.renameLayer', meta: { layerId, name } },
        err,
        'Layer DAL renameLayer crashed',
      )
      return null
    }
  },

  setLayerLock: async (layerId: string, isLocked: boolean) => {
    try {
      return await prisma.layer.update({
        where: { id: layerId },
        data: { isLocked },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'layer.setLayerLock',
          meta: { layerId, isLocked },
        },
        err,
        'Layer DAL setLayerLock crashed',
      )
      return null
    }
  },

  setLayerVisibility: async (layerId: string, isVisible: boolean) => {
    try {
      return await prisma.layer.update({
        where: { id: layerId },
        data: { isVisible },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'layer.setLayerVisibility',
          meta: { layerId, isVisible },
        },
        err,
        'Layer DAL setLayerVisibility crashed',
      )
      return null
    }
  },

  updateLayerZIndex: async (layerId: string, zIndex: number) => {
    try {
      return await prisma.layer.update({
        where: { id: layerId },
        data: { zIndex },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'layer.updateLayerZIndex',
          meta: { layerId, zIndex },
        },
        err,
        'Layer DAL updateLayerZIndex crashed',
      )
      return null
    }
  },

  deleteLayer: async (layerId: string) => {
    try {
      return await prisma.layer.update({
        where: { id: layerId },
        data: {
          deletedAt: new Date(),
        },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'layer.deleteLayer', meta: { layerId } },
        err,
        'Layer DAL deleteLayer crashed',
      )
      return null
    }
  },
}
