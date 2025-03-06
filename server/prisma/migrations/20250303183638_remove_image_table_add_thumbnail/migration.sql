/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image_Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image_Post" DROP CONSTRAINT "Image_Post_img_id_fkey";

-- DropForeignKey
ALTER TABLE "Image_Post" DROP CONSTRAINT "Image_Post_post_id_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "thumbnail" TEXT;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Image_Post";
