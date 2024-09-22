/*
  Warnings:

  - Added the required column `tracking_start_date` to the `Debt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "tracking_start_date" TEXT NOT NULL;
