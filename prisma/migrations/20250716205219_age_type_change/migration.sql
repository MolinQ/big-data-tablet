/*
  Warnings:

  - Changed the type of `age` on the `TableData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TableData" DROP COLUMN "age",
ADD COLUMN     "age" TIMESTAMP(3) NOT NULL;
