/*
  Warnings:

  - Added the required column `bio` to the `interviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_registration` to the `interviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profissional_registration` to the `interviewers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `interviewers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SPECIALTIES" AS ENUM ('CARDIOLOGIA', 'DERMATOLOGIA', 'ENDOCRINOLOGIA', 'GASTROENTEROLOGIA', 'GINECOLOGIA', 'NEUROLOGIA', 'OFTALMOLOGIA', 'ORTOPEDIA', 'PEDIATRIA', 'PSIQUIATRIA', 'CLINICA_GERAL', 'MEDICINA_DO_TRABALHO', 'MEDICINA_PREVENTIVA');

-- CreateEnum
CREATE TYPE "PROFESSIONAL_REGISTRATIONS" AS ENUM ('CRM', 'COREM');

-- AlterTable
ALTER TABLE "interviewers" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "number_registration" TEXT NOT NULL,
ADD COLUMN     "profissional_registration" "PROFESSIONAL_REGISTRATIONS" NOT NULL,
ADD COLUMN     "specialty" "SPECIALTIES" NOT NULL;
