-- DropIndex
DROP INDEX `students_password_key` ON `students`;

-- AlterTable
ALTER TABLE `lecturer` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'LECTURER';

-- AlterTable
ALTER TABLE `students` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'STUDENT',
    MODIFY `password` VARCHAR(500) NOT NULL;
