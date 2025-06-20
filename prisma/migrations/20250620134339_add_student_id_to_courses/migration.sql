/*
  Warnings:

  - Added the required column `student_id` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `student_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `courses_lecturer_id_fkey` ON `courses`(`lecturer_id`, `student_id`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
