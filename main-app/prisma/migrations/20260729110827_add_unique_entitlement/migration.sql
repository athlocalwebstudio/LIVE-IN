/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `Entitlement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_userId_gameId_key" ON "Entitlement"("userId", "gameId");
