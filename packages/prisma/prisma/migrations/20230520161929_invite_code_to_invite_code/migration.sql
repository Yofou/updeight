/*
  Warnings:

  - You are about to drop the column `invite_code` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Organization_invite_code_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "invite_code",
ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_inviteCode_key" ON "Organization"("inviteCode");
