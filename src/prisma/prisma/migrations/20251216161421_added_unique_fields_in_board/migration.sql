/*
  Warnings:

  - You are about to drop the column `metadata` on the `Board` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,ownerId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,deletedAt]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "metadata";

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_ownerId_key" ON "Board"("id", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_id_deletedAt_key" ON "Board"("id", "deletedAt");
