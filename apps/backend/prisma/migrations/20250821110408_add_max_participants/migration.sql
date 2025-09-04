-- AlterTable
ALTER TABLE `quests` ADD COLUMN `max_participants` INTEGER NULL,
    ADD COLUMN `tags` JSON NULL;
