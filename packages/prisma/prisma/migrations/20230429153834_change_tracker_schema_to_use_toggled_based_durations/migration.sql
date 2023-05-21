/*
  Warnings:

  - You are about to drop the column `before` on the `Tracker` table. All the data in the column will be lost.
  - You are about to drop the column `current` on the `Tracker` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Tracker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tracker" DROP COLUMN "before",
DROP COLUMN "current",
DROP COLUMN "duration",
ADD COLUMN     "beforeDuration" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "isToggledOn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastToggledOn" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
