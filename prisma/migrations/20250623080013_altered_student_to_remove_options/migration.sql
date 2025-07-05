/*
  Warnings:

  - Added the required column `student_id` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Invitation_token_key` ON `invitation`;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `student_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `invitation` MODIFY `token` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `students` MODIFY `firstname` VARCHAR(25) NULL,
    MODIFY `lastname` VARCHAR(25) NULL,
    MODIFY `email` VARCHAR(55) NOT NULL;

-- CreateIndex
CREATE INDEX `courses_student_id_idx` ON `courses`(`student_id`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `courses` RENAME INDEX `courses_lecturer_id_fkey` TO `courses_lecturer_id_idx`;
