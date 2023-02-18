/*
  Warnings:

  - You are about to drop the column `updated` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "updated",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
