/*
  Warnings:

  - You are about to drop the column `organsiztionId` on the `Client` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_organsiztionId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "organsiztionId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
