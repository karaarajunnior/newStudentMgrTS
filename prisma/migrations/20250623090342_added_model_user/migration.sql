-- AlterTable
ALTER TABLE `students` MODIFY `resetToken` VARCHAR(255) NULL,
    MODIFY `resetTokenExpiry` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `otp` INTEGER NOT NULL,
    `qrcode` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'ADMIN',
    `Status` VARCHAR(191) NOT NULL DEFAULT 'active',

    UNIQUE INDEX `User_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
