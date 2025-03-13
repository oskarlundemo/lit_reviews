/*
  Warnings:

  - The primary key for the `BookCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category` on the `BookCategory` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `BookCategory` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `BookCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_pkey",
DROP COLUMN "category",
DROP COLUMN "id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("category_id", "book_id");

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
