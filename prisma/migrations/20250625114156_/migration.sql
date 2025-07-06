/*
  Warnings:

  - A unique constraint covering the columns `[stripe_invoice_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_invoice_id` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "stripe_invoice_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_stripe_invoice_id_key" ON "invoices"("stripe_invoice_id");
