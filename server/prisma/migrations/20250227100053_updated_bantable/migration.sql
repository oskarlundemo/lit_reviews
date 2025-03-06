/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Banned` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Banned_user_id_key" ON "Banned"("user_id");
