/*
  Warnings:

  - Made the column `firstname` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resetToken` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resetTokenExpiry` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `students` MODIFY `firstname` VARCHAR(25) NOT NULL,
    MODIFY `lastname` VARCHAR(25) NOT NULL,
    MODIFY `resetToken` VARCHAR(255) NOT NULL,
    MODIFY `resetTokenExpiry` DATETIME(3) NOT NULL;
