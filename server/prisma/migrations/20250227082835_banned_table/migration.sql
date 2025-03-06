-- CreateTable
CREATE TABLE "Banned" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Banned_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Banned" ADD CONSTRAINT "Banned_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
