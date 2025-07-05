/*
  Warnings:

  - You are about to drop the column `Status` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `qrcode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - Added the required column `Isverified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otpexpiry` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Status`,
    DROP COLUMN `qrcode`,
    DROP COLUMN `role`,
    ADD COLUMN `Isverified` BOOLEAN NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `otpexpiry` DATETIME(3) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `otpVerification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner` VARCHAR(191) NOT NULL,
    `expiry` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `otpVerification_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
