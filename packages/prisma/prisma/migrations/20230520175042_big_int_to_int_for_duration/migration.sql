/*
  Warnings:

  - You are about to alter the column `beforeDuration` on the `Tracker` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Tracker" ALTER COLUMN "beforeDuration" SET DATA TYPE INTEGER;
