// import { ShapeType } from '@/prisma/generated/prisma/enums'
// import { prisma } from '@/lib/prisma/prisma'
// import { Prisma } from '@/prisma/generated/prisma/client'
// import { logError } from '@/lib/logger/helper'
//
// export const shapeDal = {
//   create: async (
//     boardId: string,
//     layerId: string,
//     type: ShapeType,
//     dataJson: Prisma.InputJsonValue,
//     styleJson: Prisma.InputJsonValue,
//     ownerId: string,
//     zIndex: number,
//   ) => {
//     try {
//       return await prisma.shape.create({
//         data: {
//           boardId,
//           layerId,
//           type,
//           dataJson,
//           styleJson,
//           ownerId,
//           zIndex,
//         },
//       })
//     } catch (err) {
//       logError(
//         {
//           event: 'db',
//           action: 'shape.create',
//           meta: { boardId, layerId, ownerId, type },
//         },
//         err,
//         'Shape DAL create crashed',
//       )
//       return null
//     }
//   },
//
//   loadByBoard: async (boardId: string) => {
//     try {
//       return prisma.shape.findMany({
//         where: { boardId },
//         orderBy: [
//           {
//             layerId: 'asc',
//           },
//           {
//             zIndex: 'asc',
//           },
//         ],
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'shape.loadByBoard', meta: { boardId } },
//         err,
//         'Shape DAL loadByBoard crashed',
//       )
//       return null
//     }
//   },
//
//   update: async (
//     shapeId: string,
//     data: {
//       dataJson?: Prisma.InputJsonValue
//       styleJson?: Prisma.InputJsonValue
//       zIndex?: number
//       layerId?: string
//     },
//   ) => {
//     try {
//       return await prisma.shape.update({
//         where: { id: shapeId },
//         data,
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'shape.update', meta: { shapeId } },
//         err,
//         'Shape DAL update crashed',
//       )
//       return null
//     }
//   },
//
//   remove: async (shapeId: string) => {
//     try {
//       return await prisma.shape.update({
//         where: { id: shapeId },
//         data: { deletedAt: new Date() },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'shape.removeShape', meta: { shapeId } },
//         err,
//         'Shape DAL removeShape crashed',
//       )
//       return null
//     }
//   },
// }
