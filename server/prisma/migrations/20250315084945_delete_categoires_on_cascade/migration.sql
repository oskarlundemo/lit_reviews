-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_category_id_fkey";

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
