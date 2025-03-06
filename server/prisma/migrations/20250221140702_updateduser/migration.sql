/*
  Warnings:

  - You are about to drop the `Author_Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Author_Post" DROP CONSTRAINT "Author_Post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Author_Post" DROP CONSTRAINT "Author_Post_user_id_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Author_Post";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
