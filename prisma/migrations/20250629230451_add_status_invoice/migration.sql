/*
  Warnings:

  - Made the column `stripe_product_id` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "STATUS_SIGNATURE" ADD VALUE 'CHECKOUT';

-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "stripe_product_id" SET NOT NULL;
