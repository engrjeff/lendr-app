-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('IN_PROGRESS', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "status" "DebtStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "balance" DOUBLE PRECISION NOT NULL,
    "minimum_payment" DOUBLE PRECISION NOT NULL,
    "next_payment_due_date" TEXT NOT NULL,
    "is_mine" BOOLEAN DEFAULT true,
    "lendee_name" TEXT,
    "lendee_email" TEXT,
    "should_notify" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Debt_nickname_user_id_key" ON "Debt"("nickname", "user_id");

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
