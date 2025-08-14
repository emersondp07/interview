/*
  Warnings:

  - Added the required column `age` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MASC', 'FEM', 'OTHER');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "gender" "GENDER" NOT NULL,
ADD COLUMN     "medicalHistory" TEXT,
ADD COLUMN     "medications" TEXT;
