-- DropForeignKey
ALTER TABLE `tips` DROP FOREIGN KEY `tips_ibfk_2`;

-- AddForeignKey
ALTER TABLE `tips` ADD CONSTRAINT `tips_ibfk_2` FOREIGN KEY (`item`) REFERENCES `collections`(`item_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
