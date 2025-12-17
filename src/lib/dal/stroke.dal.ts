// import { prisma } from '@/lib/prisma/prisma'
// import { logError } from '@/lib/logger/helper'
// import { Prisma } from '@/prisma/generated/prisma/client'
//
// export const strokeDal = {
//   create: async (
//     boardId: string,
//     layerId: string,
//     ownerId: string,
//     pointsBlob: Prisma.Bytes,
//     penPropsJson: Prisma.InputJsonValue,
//   ) => {
//     try {
//       return await prisma.stroke.create({
//         data: {
//           boardId,
//           layerId,
//           ownerId,
//           pointsBlob,
//           penPropsJson,
//         },
//       })
//     } catch (err) {
//       logError(
//         {
//           event: 'db',
//           action: 'stroke.create',
//           meta: { boardId, layerId, ownerId },
//         },
//         err,
//         'Stroke DAL create crashed',
//       )
//       return null
//     }
//   },
//
//   listByBoard: async (boardId: string) => {
//     try {
//       return await prisma.stroke.findMany({
//         where: { boardId },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'stroke.listByBoard', meta: { boardId } },
//         err,
//         'Stroke DAL listByBoard crashed',
//       )
//       return null
//     }
//   },
//
//   remove: async (strokeId: string) => {
//     try {
//       return await prisma.stroke.delete({
//         where: { id: strokeId },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'stroke.remove', meta: { strokeId } },
//         err,
//         'Stroke DAL remove crashed',
//       )
//       return null
//     }
//   },
// }
