/*
  Warnings:

  - Added the required column `age` to the `TableData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `TableData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TableData" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL;
