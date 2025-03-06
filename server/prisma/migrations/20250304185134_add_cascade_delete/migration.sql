-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_book_id_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
