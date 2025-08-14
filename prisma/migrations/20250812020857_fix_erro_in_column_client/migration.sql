/*
  Warnings:

  - You are about to drop the column `emergencyContact` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistory` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "emergencyContact",
DROP COLUMN "emergencyPhone",
DROP COLUMN "medicalHistory",
ADD COLUMN     "emergency_contact" TEXT,
ADD COLUMN     "emergency_phone" TEXT,
ADD COLUMN     "medical_history" TEXT;
