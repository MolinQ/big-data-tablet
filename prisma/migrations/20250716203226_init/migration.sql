-- CreateTable
CREATE TABLE "TableData" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "TableData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableData_email_key" ON "TableData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TableData_phone_key" ON "TableData"("phone");
