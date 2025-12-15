-- DropIndex
DROP INDEX "BoardMember_boardId_idx";

-- DropIndex
DROP INDEX "BoardMember_userId_idx";

-- AlterTable
ALTER TABLE "BoardMember" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "BoardMember_boardId_userId_idx" ON "BoardMember"("boardId", "userId");

-- CreateIndex
CREATE INDEX "BoardMember_inviteToken_idx" ON "BoardMember"("inviteToken");
