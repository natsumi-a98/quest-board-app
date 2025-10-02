/*
  Warnings:

  - A unique constraint covering the columns `[firebase_uid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `quests` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `firebase_uid` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_firebase_uid_key` ON `users`(`firebase_uid`);
