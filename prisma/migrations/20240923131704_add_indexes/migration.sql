-- CreateIndex
CREATE INDEX "Debt_status_idx" ON "Debt"("status");

-- CreateIndex
CREATE INDEX "InstallmentPlanItem_debtId_idx" ON "InstallmentPlanItem"("debtId");

-- CreateIndex
CREATE INDEX "InstallmentPlanItem_status_idx" ON "InstallmentPlanItem"("status");
