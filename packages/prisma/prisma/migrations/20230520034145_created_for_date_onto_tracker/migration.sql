/*
  Warnings:

  - Added the required column `createdFor` to the `Tracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tracker" ADD COLUMN     "createdFor" TIMESTAMP(3) NOT NULL;
