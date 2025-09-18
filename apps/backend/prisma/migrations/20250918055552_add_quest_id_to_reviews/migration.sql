/*
  Warnings:

  - A unique constraint covering the columns `[reviewer_id,quest_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quest_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `quest_id` INTEGER NOT NULL,
    MODIFY `guest_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `reviews_quest_id_fkey` ON `reviews`(`quest_id`);

-- CreateIndex
CREATE UNIQUE INDEX `reviews_reviewer_quest_unique` ON `reviews`(`reviewer_id`, `quest_id`);

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_quest_id_fkey` FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
