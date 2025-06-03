/*
  Warnings:

  - The values [ADMINISTRATOR] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `birthDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `Client` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `signature_id` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company_id` on table `Signature` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan_id` on table `Signature` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('ADMIN', 'COMPANY', 'INTERVIEWER', 'CLIENT');
ALTER TABLE "Administrator" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TABLE "Company" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TABLE "Interviewer" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TABLE "Client" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_signature_id_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_plan_id_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "birthDate",
DROP COLUMN "documentType",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "document_type" "DOCUMENT_TYPE" NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "signature_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Signature" ALTER COLUMN "company_id" SET NOT NULL,
ALTER COLUMN "plan_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_signature_id_fkey" FOREIGN KEY ("signature_id") REFERENCES "Signature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
