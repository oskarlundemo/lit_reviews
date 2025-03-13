-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_book_id_fkey";

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
