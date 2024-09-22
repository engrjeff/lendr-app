-- CreateEnum
CREATE TYPE "InstallmentPlanItemStatus" AS ENUM ('UPCOMING', 'PAST_DUE', 'PAID');

-- CreateTable
CREATE TABLE "InstallmentPlanItem" (
    "id" TEXT NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "paymentAmount" TEXT NOT NULL,
    "status" "InstallmentPlanItemStatus" NOT NULL DEFAULT 'UPCOMING',
    "note" TEXT,
    "debtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallmentPlanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstallmentPlanItem" ADD CONSTRAINT "InstallmentPlanItem_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
