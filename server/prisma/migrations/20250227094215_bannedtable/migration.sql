/*
  Warnings:

  - The primary key for the `Banned` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Banned" DROP CONSTRAINT "Banned_pkey",
ADD CONSTRAINT "Banned_pkey" PRIMARY KEY ("id", "user_id");
