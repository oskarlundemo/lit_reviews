/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");
