/*
  Warnings:

  - The values [MASC] on the enum `GENDER` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GENDER_new" AS ENUM ('MALE', 'FEM', 'OTHER');
ALTER TABLE "clients" ALTER COLUMN "gender" TYPE "GENDER_new" USING ("gender"::text::"GENDER_new");
ALTER TYPE "GENDER" RENAME TO "GENDER_old";
ALTER TYPE "GENDER_new" RENAME TO "GENDER";
DROP TYPE "GENDER_old";
COMMIT;
