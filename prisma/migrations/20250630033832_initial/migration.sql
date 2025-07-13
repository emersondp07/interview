/*
  Warnings:

  - You are about to drop the column `company_id` on the `signatures` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[signature_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature_id` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "signatures" DROP CONSTRAINT "signatures_company_id_fkey";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "signature_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "signatures" DROP COLUMN "company_id";

-- CreateIndex
CREATE UNIQUE INDEX "companies_signature_id_key" ON "companies"("signature_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "signatures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
