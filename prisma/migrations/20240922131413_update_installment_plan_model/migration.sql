/*
  Warnings:

  - You are about to drop the column `paymentAmount` on the `InstallmentPlanItem` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDate` on the `InstallmentPlanItem` table. All the data in the column will be lost.
  - Added the required column `payment_amount` to the `InstallmentPlanItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_date` to the `InstallmentPlanItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstallmentPlanItem" DROP COLUMN "paymentAmount",
DROP COLUMN "paymentDate",
ADD COLUMN     "payment_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "payment_date" TEXT NOT NULL;
