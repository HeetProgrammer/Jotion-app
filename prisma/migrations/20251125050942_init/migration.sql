/*
  Warnings:

  - The `content` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "content",
ADD COLUMN     "content" JSONB;

-- CreateIndex
CREATE INDEX "File_workspaceId_idx" ON "File"("workspaceId");

-- CreateIndex
CREATE INDEX "File_parentId_idx" ON "File"("parentId");
