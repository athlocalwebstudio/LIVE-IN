/*
  Warnings:

  - You are about to drop the column `purchasedAt` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "purchasedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
