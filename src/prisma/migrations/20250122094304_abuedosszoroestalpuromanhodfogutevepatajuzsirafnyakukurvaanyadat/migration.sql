-- CreateTable
CREATE TABLE `achievements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NOT NULL,
    `goal` INTEGER NOT NULL,
    `is_secret` BOOLEAN NOT NULL,
    `parent` INTEGER NULL,

    INDEX `parent`(`parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_rights` (
    `admin` INTEGER NOT NULL,
    `is_super` BOOLEAN NOT NULL,
    `delete_users` BOOLEAN NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `admin`(`admin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `item_id`(`item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `controls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `settings` INTEGER NOT NULL,
    `is_tap_mode` BOOLEAN NOT NULL DEFAULT false,
    `copy` VARCHAR(3) NOT NULL DEFAULT 'LMB',
    `remove` VARCHAR(3) NOT NULL DEFAULT 'RMB',

    UNIQUE INDEX `settings`(`settings`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crafting_table_slots` (
    `tip` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `status` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `status`(`status`),
    INDEX `tip`(`tip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `difficulties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `color_code` VARCHAR(6) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `color_code`(`color_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gamemodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `icon` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `difficulty` INTEGER NOT NULL,

    UNIQUE INDEX `name`(`name`),
    INDEX `difficulty`(`difficulty`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `games` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `player` INTEGER NOT NULL,
    `riddle` VARCHAR(255) NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `is_solved` BOOLEAN NOT NULL,

    INDEX `player`(`player`),
    INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guess_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `type`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hints` (
    `game` INTEGER NOT NULL,
    `number` INTEGER NOT NULL,
    `content` VARCHAR(255) NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `game`(`game`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories_items` (
    `game` INTEGER NOT NULL,
    `item` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `game`(`game`),
    INDEX `item`(`item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `src` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `item_id`(`item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user` INTEGER NOT NULL,
    `start` DATETIME(0) NOT NULL,
    `end` DATETIME(0) NOT NULL,

    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_borders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `src` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile_pictures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `src` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rewards` (
    `achievement` INTEGER NOT NULL,
    `reward` INTEGER NOT NULL,
    `reward_type` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `achievement`(`achievement`),
    INDEX `reward_type`(`reward_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user` INTEGER NOT NULL,
    `volume` INTEGER NOT NULL DEFAULT 50,
    `image_size` INTEGER NOT NULL DEFAULT 50,
    `is_set` BOOLEAN NOT NULL,

    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `table_mappings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `control` INTEGER NOT NULL,
    `slot` INTEGER NOT NULL,
    `hot_key` VARCHAR(1) NULL,

    INDEX `control`(`control`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `game` INTEGER NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `item` VARCHAR(255) NOT NULL,

    INDEX `game`(`game`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `user` INTEGER NOT NULL,
    `login_token` VARCHAR(255) NOT NULL,
    `is_expire` BOOLEAN NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `user`(`user`),
    UNIQUE INDEX `login_token`(`login_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(16) NULL,
    `password` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `is_guest` BOOLEAN NOT NULL,
    `socket_id` VARCHAR(255) NULL,

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_achievements` (
    `user` INTEGER NOT NULL,
    `achievement` INTEGER NOT NULL,
    `progress` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `achievement`(`achievement`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_collections` (
    `user` INTEGER NOT NULL,
    `collection` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `collection`(`collection`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_profile_borders` (
    `user` INTEGER NOT NULL,
    `profile_border` INTEGER NOT NULL,
    `is_set` BOOLEAN NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `profile_border`(`profile_border`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_profile_pictures` (
    `user` INTEGER NOT NULL,
    `profile_picture` INTEGER NOT NULL,
    `is_set` BOOLEAN NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `profile_picture`(`profile_picture`),
    INDEX `user`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `achievements` ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `admin_rights` ADD CONSTRAINT `admin_rights_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `controls` ADD CONSTRAINT `controls_ibfk_1` FOREIGN KEY (`settings`) REFERENCES `settings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `crafting_table_slots` ADD CONSTRAINT `crafting_table_slots_ibfk_1` FOREIGN KEY (`tip`) REFERENCES `tips`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `crafting_table_slots` ADD CONSTRAINT `crafting_table_slots_ibfk_2` FOREIGN KEY (`status`) REFERENCES `guess_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `gamemodes` ADD CONSTRAINT `gamemodes_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulties`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`type`) REFERENCES `gamemodes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_2` FOREIGN KEY (`player`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hints` ADD CONSTRAINT `hints_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventories_items` ADD CONSTRAINT `inventories_items_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `inventories_items` ADD CONSTRAINT `inventories_items_ibfk_2` FOREIGN KEY (`item`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `maintenance` ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rewards` ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`achievement`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rewards` ADD CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`reward_type`) REFERENCES `reward_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `settings` ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `table_mappings` ADD CONSTRAINT `table_mappings_ibfk_1` FOREIGN KEY (`control`) REFERENCES `controls`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tips` ADD CONSTRAINT `tips_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_achievements` ADD CONSTRAINT `users_achievements_ibfk_1` FOREIGN KEY (`achievement`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_achievements` ADD CONSTRAINT `users_achievements_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_collections` ADD CONSTRAINT `users_collections_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_collections` ADD CONSTRAINT `users_collections_ibfk_2` FOREIGN KEY (`collection`) REFERENCES `collections`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_profile_borders` ADD CONSTRAINT `users_profile_borders_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_profile_borders` ADD CONSTRAINT `users_profile_borders_ibfk_2` FOREIGN KEY (`profile_border`) REFERENCES `profile_borders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_profile_pictures` ADD CONSTRAINT `users_profile_pictures_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `users_profile_pictures` ADD CONSTRAINT `users_profile_pictures_ibfk_2` FOREIGN KEY (`profile_picture`) REFERENCES `profile_pictures`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
