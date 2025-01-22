-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 22. 10:32
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `craftdle_db`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `asd` ()   BEGIN
    SELECT *
    FROM achievements
    WHERE goal BETWEEN 25 AND 50;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `goal` int(11) NOT NULL,
  `is_secret` tinyint(1) NOT NULL,
  `parent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `achievements`
--

INSERT INTO `achievements` (`id`, `title`, `description`, `icon`, `goal`, `is_secret`, `parent`) VALUES
(1, 'Welcome to the Database!', 'Create a Craftdle account', 'Welcome.png', 1, 0, NULL),
(2, 'The collector', 'Collect 100 items', 'The_Collector.png', 1, 0, NULL),
(3, 'Here\'s Johnny!!!', 'Collect all axes', 'Johnny.png', 6, 0, NULL),
(4, 'The first of all', 'Be the first to solve the daily riddle', 'First_of_All.png', 1, 0, NULL),
(5, 'Still a beginner?', 'Play 25 tutorial game', 'Beginner.png', 25, 1, NULL),
(6, 'The master chef', 'Solve a food riddle in resource mode', 'Cook.png', 1, 1, NULL),
(7, 'Cheater?!', 'Solve a riddle with only one guess', 'Cheat.png', 1, 1, NULL),
(8, 'Wish I Had an Angel', 'Craft the Guideian Angel logo', 'GA.png', 1, 1, NULL),
(9, 'Casual Player I', 'Solve 5 Classic games', 'Classic.png', 5, 0, NULL),
(10, 'Casual Player II', 'Solve 10 Classic games', 'Classic.png', 10, 0, 9),
(11, 'Casual Player III', 'Solve 25 Classic games', 'Classic.png', 25, 0, 10),
(12, 'Casual Player IV', 'Solve 50 Classic games', 'Classic.png', 50, 0, 11),
(13, 'Casual Player V', 'Solve 100 Classic games', 'Classic.png', 100, 0, 12),
(14, 'Daily Challenger I', 'Complete 5 Daily games', 'Daily.png', 5, 0, NULL),
(15, 'Daily Challenger II', 'Complete 10 Daily games', 'Daily.png', 10, 0, 14),
(16, 'Daily Challenger III', 'Complete 25 Daily games', 'Daily.png', 25, 0, 15),
(17, 'Daily Challenger IV', 'Complete 50 Daily games', 'Daily.png', 50, 0, 16),
(18, 'Daily Challenger V', 'Complete 100 Daily games', 'Daily.png', 100, 0, 17),
(19, 'Master of All I', 'Solve 5 All in One games', 'All_in_One.png', 5, 0, NULL),
(20, 'Master of All II', 'Solve 10 All in One games', 'All_in_One.png', 10, 0, 19),
(21, 'Master of All III', 'Solve 25 All in One games', 'All_in_One.png', 25, 0, 20),
(22, 'Master of All IV', 'Solve 50 All in One games', 'All_in_One.png', 50, 0, 21),
(23, 'Master of All V', 'Solve 100 All in One games', 'All_in_One.png', 100, 0, 22),
(24, 'Pocket Crafter I', 'Solve 5 Pocket games', 'Pocket.png', 5, 0, NULL),
(25, 'Pocket Crafter II', 'Solve 10 Pocket games', 'Pocket.png', 10, 0, 24),
(26, 'Pocket Crafter III', 'Solve 25 Pocket games', 'Pocket.png', 25, 0, 25),
(27, 'Pocket Crafter IV', 'Solve 50 Pocket games', 'Pocket.png', 50, 0, 26),
(28, 'Pocket Crafter V', 'Solve 100 Pocket games', 'Pocket.png', 100, 0, 27),
(29, 'Resourceful I', 'Solve 5 Resource games', 'Resource.png', 5, 0, NULL),
(30, 'Resourceful II', 'Solve 10 Resource games', 'Resource.png', 10, 0, 29),
(31, 'Resourceful III', 'Solve 25 Resource games', 'Resource.png', 25, 0, 30),
(32, 'Resourceful IV', 'Solve 50 Resource games', 'Resource.png', 50, 0, 31),
(33, 'Resourceful V', 'Solve 100 Resource games', 'Resource.png', 100, 0, 32),
(34, 'Survivor I', 'Solve 5 Hardcore games', 'Hardcore.png', 5, 0, NULL),
(35, 'Survivor II', 'Solve 10 Hardcore games', 'Hardcore.png', 10, 0, 34),
(36, 'Survivor III', 'Solve 25 Hardcore games', 'Hardcore.png', 25, 0, 35),
(37, 'Survivor IV', 'Solve 50 Hardcore games', 'Hardcore.png', 50, 0, 36),
(38, 'Survivor V', 'Solve 100 Hardcore games', 'Hardcore.png', 100, 0, 37),
(39, 'The Armorer', 'Solve a Blast Furnace riddle', 'Blast_Furnace.png', 1, 0, NULL),
(40, 'The Butcher', 'Solve a Smoker riddle', 'Smoker.png', 1, 0, NULL),
(41, 'The Cartographer', 'Solve a Cartography Table riddle', 'Cartography_Table.png', 1, 0, NULL),
(42, 'The Cleric', 'Solve a Brewing Stand riddle', 'Brewing_Stand.png', 1, 0, NULL),
(43, 'The Farmer', 'Solve a Composter riddle', 'Composter.png', 1, 0, NULL),
(44, 'The Fisherman', 'Solve a Barrel riddle', 'Barrel.png', 1, 0, NULL),
(45, 'The Fletcher', 'Solve a Fletching Table riddle', 'Fletching_Table.png', 1, 0, NULL),
(46, 'The Leatherworker', 'Solve a Cauldron riddle', 'Cauldron.png', 1, 0, NULL),
(47, 'The Librarian', 'Solve a Lectern riddle', 'Lectern.png', 1, 0, NULL),
(48, 'The Mason', 'Solve a Stonecutter riddle', 'Stonecutter.png', 1, 0, NULL),
(49, 'The Shepherd', 'Solve a Loom riddle', 'Loom.png', 1, 0, NULL),
(50, 'The Toolsmith', 'Solve a Smithing Table riddle', 'Smithing_Table.png', 1, 0, NULL),
(51, 'The Weaponsmith', 'Solve a Grindstone riddle', 'Grindstone.png', 1, 0, NULL),
(52, 'Birds of a feather flock together', 'Solve a riddle where you guessed 5 items that made of chicken', 'Feather.png', 5, 0, NULL),
(53, 'End of the line', 'Watch the credits', 'Eye.png', 1, 1, NULL),
(54, 'A whole year', 'Have a 365 day streak', 'Fire.png', 1, 0, NULL),
(55, 'The first riddle of the year', 'Solve a riddle in the first minute of the year!', 'Firework.png', 1, 1, NULL),
(56, 'Wax that copper', 'Solve a riddle with only waxed copper guesses except one', 'Wax.png', 1, 1, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin_rights`
--

CREATE TABLE `admin_rights` (
  `admin` int(11) NOT NULL,
  `is_super` tinyint(1) NOT NULL,
  `delete_users` tinyint(1) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `item_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `collections`
--

INSERT INTO `collections` (`id`, `item_id`, `name`, `image`) VALUES
(1, 'activator_rail', 'Activator Rail', 'Activator_Rail.png'),
(2, 'andesite', 'Andesite', 'Andesite.png'),
(3, 'andesite_slab', 'Andesite Slab', 'Andesite_Slab.png'),
(4, 'andesite_stairs', 'Andesite Stairs', 'Andesite_Stairs.png'),
(5, 'andesite_wall', 'Andesite Wall', 'Andesite_Wall.png'),
(6, 'anvil', 'Anvil', 'Anvil.png'),
(7, 'armor_stand', 'Armor Stand', 'Armor_Stand.png'),
(8, 'arrow', 'Arrow', 'Arrow.png'),
(9, 'wooden_axe', 'Wooden Axe', 'Wooden_Axe.png'),
(10, 'stone_axe', 'Stone Axe', 'Stone_Axe.png'),
(11, 'iron_axe', 'Iron Axe', 'Iron_Axe.png'),
(12, 'golden_axe', 'Golden Axe', 'Golden_Axe.png'),
(13, 'diamond_axe', 'Diamond Axe', 'Diamond_Axe.png'),
(14, 'bamboo_mosaic', 'Bamboo Mosaic', 'Bamboo_Mosaic.png'),
(15, 'bamboo_mosaic_slab', 'Bamboo Mosaic Slab', 'Bamboo_Mosaic_Slab.png'),
(16, 'bamboo_mosaic_stairs', 'Bamboo Mosaic Stairs', 'Bamboo_Mosaic_Stairs.png'),
(17, 'field_masoned_banner_pattern', 'Field Masoned Banner Pattern', 'Field_Masoned_Banner_Pattern.png'),
(18, 'bordure_indented_banner_pattern', 'Bordure Indented Banner Pattern', 'Bordure_Indented_Banner_Pattern.png'),
(19, 'flower_charge_banner_pattern', 'Flower Charge Banner Pattern', 'Flower_Charge_Banner_Pattern.png'),
(20, 'creeper_charge_banner_pattern', 'Creeper Charge Banner Pattern', 'Creeper_Charge_Banner_Pattern.png'),
(21, 'skull_charge_banner_pattern', 'Skull Charge Banner Pattern', 'Skull_Charge_Banner_Pattern.png'),
(22, 'thing_banner_pattern', 'Thing Banner Pattern', 'Thing_Banner_Pattern.png'),
(23, 'barrel', 'Barrel', 'Barrel.png'),
(24, 'beacon', 'Beacon', 'Beacon.png'),
(25, 'beehive', 'Beehive', 'Beehive.png'),
(26, 'beetroot_soup', 'Beetroot Soup', 'Beetroot_Soup.png'),
(27, 'blackstone_slab', 'Blackstone Slab', 'Blackstone_Slab.png'),
(28, 'blackstone_stairs', 'Blackstone Stairs', 'Blackstone_Stairs.png'),
(29, 'blackstone_wall', 'Blackstone Wall', 'Blackstone_Wall.png'),
(30, 'blast_furnace', 'Blast Furnace', 'Blast_Furnace.png'),
(31, 'blaze_powder', 'Blaze Powder', 'Blaze_Powder.png'),
(32, 'block_of_amethyst', 'Block of Amethyst', 'Block_of_Amethyst.png'),
(33, 'block_of_bamboo', 'Block of Bamboo', 'Block_of_Bamboo.png'),
(34, 'block_of_coal', 'Block of Coal', 'Block_of_Coal.png'),
(35, 'block_of_copper', 'Block of Copper', 'Block_of_Copper.png'),
(36, 'block_of_diamond', 'Block of Diamond', 'Block_of_Diamond.png'),
(37, 'block_of_emerald', 'Block of Emerald', 'Block_of_Emerald.png'),
(38, 'block_of_gold', 'Block of Gold', 'Block_of_Gold.png'),
(39, 'block_of_iron', 'Block of Iron', 'Block_of_Iron.png'),
(40, 'block_of_lapis_lazuli', 'Block of Lapis Lazuli', 'Block_of_Lapis_Lazuli.png'),
(41, 'block_of_netherite', 'Block of Netherite', 'Block_of_Netherite.png'),
(42, 'block_of_quartz', 'Block of Quartz', 'Block_of_Quartz.png'),
(43, 'block_of_raw_copper', 'Block of Raw Copper', 'Block_of_Raw_Copper.png'),
(44, 'block_of_raw_gold', 'Block of Raw Gold', 'Block_of_Raw_Gold.png'),
(45, 'block_of_raw_iron', 'Block of Raw Iron', 'Block_of_Raw_Iron.png'),
(46, 'block_of_redstone', 'Block of Redstone', 'Block_of_Redstone.png'),
(47, 'block_of_resin', 'Block of Resin', 'Block_of_Resin.png'),
(48, 'blue_ice', 'Blue Ice', 'Blue_Ice.png'),
(49, 'oak_boat', 'Oak Boat', 'Oak_Boat.png'),
(50, 'spruce_boat', 'Spruce Boat', 'Spruce_Boat.png'),
(51, 'birch_boat', 'Birch Boat', 'Birch_Boat.png'),
(52, 'jungle_boat', 'Jungle Boat', 'Jungle_Boat.png'),
(53, 'acacia_boat', 'Acacia Boat', 'Acacia_Boat.png'),
(54, 'dark_oak_boat', 'Dark Oak Boat', 'Dark_Oak_Boat.png'),
(55, 'mangrove_boat', 'Mangrove Boat', 'Mangrove_Boat.png'),
(56, 'cherry_boat', 'Cherry Boat', 'Cherry_Boat.png'),
(57, 'pale_oak_boat', 'Pale_oak Boat', 'Pale_Oak_Boat.png'),
(58, 'bamboo_raft', 'Bamboo Raft', 'Bamboo_Raft.png'),
(59, 'oak_boat_with_chest', 'Oak Boat with Chest', 'Oak_Boat_with_Chest.png'),
(60, 'spruce_boat_with_chest', 'Spruce Boat with Chest', 'Spruce_Boat_with_Chest.png'),
(61, 'birch_boat_with_chest', 'Birch Boat with Chest', 'Birch_Boat_with_Chest.png'),
(62, 'jungle_boat_with_chest', 'Jungle Boat with Chest', 'Jungle_Boat_with_Chest.png'),
(63, 'acacia_boat_with_chest', 'Acacia Boat with Chest', 'Acacia_Boat_with_Chest.png'),
(64, 'dark_oak_boat_with_chest', 'Dark Oak Boat with Chest', 'Dark_Oak_Boat_with_Chest.png'),
(65, 'mangrove_boat_with_chest', 'Mangrove Boat with Chest', 'Mangrove_Boat_with_Chest.png'),
(66, 'cherry_boat_with_chest', 'Cherry Boat with Chest', 'Cherry_Boat_with_Chest.png'),
(67, 'pale_oak_boat_with_chest', 'Pale Oak Boat with Chest', 'Pale_Oak_Boat_with_Chest.png'),
(68, 'bamboo_raft_with_chest', 'Bamboo Raft with Chest', 'Bamboo_Raft_with_Chest.png'),
(69, 'bone_block', 'Bone Block', 'Bone_Block.png'),
(70, 'bone_meal', 'Bone Meal', 'Bone_Meal.png'),
(71, 'book', 'Book', 'Book.png'),
(72, 'book_and_Quill', 'Book and Quill', 'Book_and_Quill.png'),
(73, 'bookshelf', 'Bookshelf', 'Bookshelf.png'),
(74, 'leather_boots', 'Leather Boots', 'Leather_Boots.png'),
(75, 'iron_boots', 'Iron Boots', 'Iron_Boots.png'),
(76, 'golden_boots', 'Golden Boots', 'Golden_Boots.png'),
(77, 'diamond_boots', 'Diamond Boots', 'Diamond_Boots.png'),
(78, 'bow', 'Bow', 'Bow.png'),
(79, 'bowl', 'Bowl', 'Bowl.png'),
(80, 'bread', 'Bread', 'Bread.png'),
(81, 'brick_slab', 'Brick Slab', 'Brick_Slab.png'),
(82, 'brick_stairs', 'Brick Stairs', 'Brick_Stairs.png'),
(83, 'brick_wall', 'Brick Wall', 'Brick_Wall.png'),
(84, 'bricks', 'Bricks', 'Bricks.png'),
(85, 'dried_kelp_block', 'Dried Kelp Block', 'Dried_Kelp_Block.png'),
(86, 'brush', 'Brush', 'Brush.png'),
(87, 'bucket', 'Bucket', 'Bucket.png'),
(88, 'cake', 'Cake', 'Cake.png'),
(89, 'calibrated_sculk_sensor', 'Calibrated Sculk Sensor', 'Calibrated_Sculk_Sensor.png'),
(90, 'campfire', 'Campfire', 'Campfire.png'),
(91, 'candle', 'Candle', 'Candle.png'),
(92, 'cartography_table', 'Cartography Table', 'Cartography_Table.png'),
(93, 'cauldron', 'Cauldron', 'Cauldron.png'),
(94, 'chain', 'Chain', 'Chain.png'),
(95, 'chest', 'Chest', 'Chest.png'),
(96, 'leather_tunic', 'Leather Tunic', 'Leather_Tunic.png'),
(97, 'iron_chestplate', 'Iron Chestplate', 'Iron_Chestplate.png'),
(98, 'golden_chestplate', 'Golden Chestplate', 'Golden_Chestplate.png'),
(99, 'diamond_chestplate', 'Diamond Chestplate', 'Diamond_Chestplate.png'),
(100, 'chiseled_bookshelf', 'Chiseled Bookshelf', 'Chiseled_Bookshelf.png'),
(101, 'chiseled_copper', 'Chiseled Copper', 'Chiseled_Copper.png'),
(102, 'exposed_chiseled_copper', 'Exposed Chiseled Copper', 'Exposed_Chiseled_Copper.png'),
(103, 'weathered_chiseled_copper', 'Weathered Chiseled Copper', 'Weathered_Chiseled_Copper.png'),
(104, 'oxidized_chiseled_copper', 'Oxidized Chiseled Copper', 'Oxidized_Chiseled_Copper.png'),
(105, 'waxed_chiseled_copper', 'Waxed Chiseled Copper', 'Chiseled_Copper.png'),
(106, 'waxed_exposed_chiseled_copper', 'Waxed Exposed Chiseled Copper', 'Exposed_Chiseled_Copper.png'),
(107, 'waxed_weathered_chiseled_copper', 'Waxed Weathered Chiseled Copper', 'Weathered_Chiseled_Copper.png'),
(108, 'waxed_oxidized_chiseled_copper', 'Waxed Oxidized Chiseled Copper', 'Oxidized_Chiseled_Copper.png'),
(109, 'chiseled_deepslate', 'Chiseled Deepslate', 'Chiseled_Deepslate.png'),
(110, 'chiseled_nether_bricks', 'Chiseled Nether Bricks', 'Chiseled_Nether_Bricks.png'),
(111, 'chiseled_polished_blackstone', 'Chiseled Polished Blackstone', 'Chiseled_Polished_Blackstone.png'),
(112, 'chiseled_quartz_block', 'Chiseled Quartz Block', 'Chiseled_Quartz_Block.png'),
(113, 'chiseled_red_sandstone', 'Chiseled Red Sandstone', 'Chiseled_Red_Sandstone.png'),
(114, 'chiseled_sandstone', 'Chiseled Sandstone', 'Chiseled_Sandstone.png'),
(115, 'chiseled_stone_bricks', 'Chiseled Stone Bricks', 'Chiseled_Stone_Bricks.png'),
(116, 'chiseled_tuff', 'Chiseled Tuff', 'Chiseled_Tuff.png'),
(117, 'chiseled_tuff_bricks', 'Chiseled Tuff Bricks', 'Chiseled_Tuff_Bricks.png'),
(118, 'clay', 'Clay', 'Clay.png'),
(119, 'clock', 'Clock', 'Clock.png'),
(120, 'coarse_dirt', 'Coarse Dirt', 'Coarse_Dirt.png'),
(121, 'cobbled_deepslate_slab', 'Cobbled Deepslate Slab', 'Cobbled_Deepslate_Slab.png'),
(122, 'cobbled_deepslate_stairs', 'Cobbled Deepslate Stairs', 'Cobbled_Deepslate_Stairs.png'),
(123, 'cobbled_deepslate_wall', 'Cobbled Deepslate Wall', 'Cobbled_Deepslate_Wall.png'),
(124, 'cobblestone_slab', 'Cobblestone Slab', 'Cobblestone_Slab.png'),
(125, 'cobblestone_stairs', 'Cobblestone Stairs', 'Cobblestone_Stairs.png'),
(126, 'white_banner', 'White Banner', 'White_Banner.png'),
(127, 'light_gray_banner', 'Light Gray Banner', 'Light_Gray_Banner.png'),
(128, 'gray_banner', 'Gray Banner', 'Gray_Banner.png'),
(129, 'black_banner', 'Black Banner', 'Black_Banner.png'),
(130, 'brown_banner', 'Brown Banner', 'Brown_Banner.png'),
(131, 'red_banner', 'Red Banner', 'Red_Banner.png'),
(132, 'orange_banner', 'Orange Banner', 'Orange_Banner.png'),
(133, 'yellow_banner', 'Yellow Banner', 'Yellow_Banner.png'),
(134, 'lime_banner', 'Lime Banner', 'Lime_Banner.png'),
(135, 'green_banner', 'Green Banner', 'Green_Banner.png'),
(136, 'cyan_banner', 'Cyan Banner', 'Cyan_Banner.png'),
(137, 'light_blue_banner', 'Light Blue Banner', 'Light_Blue_Banner.png'),
(138, 'blue_banner', 'Blue Banner', 'Blue_Banner.png'),
(139, 'purple_banner', 'Purple Banner', 'Purple_Banner.png'),
(140, 'magenta_banner', 'Magenta Banner', 'Magenta_Banner.png'),
(141, 'pink_banner', 'Pink Banner', 'Pink_Banner.png'),
(142, 'white_bed', 'White Bed', 'White_Bed.png'),
(143, 'light_gray_bed', 'Light Gray Bed', 'Light_Gray_Bed.png'),
(144, 'gray_bed', 'Gray Bed', 'Gray_Bed.png'),
(145, 'black_bed', 'Black Bed', 'Black_Bed.png'),
(146, 'brown_bed', 'Brown Bed', 'Brown_Bed.png'),
(147, 'red_bed', 'Red Bed', 'Red_Bed.png'),
(148, 'orange_bed', 'Orange Bed', 'Orange_Bed.png'),
(149, 'yellow_bed', 'Yellow Bed', 'Yellow_Bed.png'),
(150, 'lime_bed', 'Lime Bed', 'Lime_Bed.png'),
(151, 'green_bed', 'Green Bed', 'Green_Bed.png'),
(152, 'cyan_bed', 'Cyan Bed', 'Cyan_Bed.png'),
(153, 'light_blue_bed', 'Light Blue Bed', 'Light_Blue_Bed.png'),
(154, 'blue_bed', 'Blue Bed', 'Blue_Bed.png'),
(155, 'purple_bed', 'Purple Bed', 'Purple_Bed.png'),
(156, 'magenta_bed', 'Magenta Bed', 'Magenta_Bed.png'),
(157, 'pink_bed', 'Pink Bed', 'Pink_Bed.png'),
(158, 'white_candle', 'White Candle', 'White_Candle.png'),
(159, 'light_gray_candle', 'Light Gray Candle', 'Light_Gray_Candle.png'),
(160, 'gray_candle', 'Gray Candle', 'Gray_Candle.png'),
(161, 'black_candle', 'Black Candle', 'Black_Candle.png'),
(162, 'brown_candle', 'Brown Candle', 'Brown_Candle.png'),
(163, 'red_candle', 'Red Candle', 'Red_Candle.png'),
(164, 'orange_candle', 'Orange Candle', 'Orange_Candle.png'),
(165, 'yellow_candle', 'Yellow Candle', 'Yellow_Candle.png'),
(166, 'lime_candle', 'Lime Candle', 'Lime_Candle.png'),
(167, 'green_candle', 'Green Candle', 'Green_Candle.png'),
(168, 'cyan_candle', 'Cyan Candle', 'Cyan_Candle.png'),
(169, 'light_blue_candle', 'Light Blue Candle', 'Light_Blue_Candle.png'),
(170, 'blue_candle', 'Blue Candle', 'Blue_Candle.png'),
(171, 'purple_candle', 'Purple Candle', 'Purple_Candle.png'),
(172, 'magenta_candle', 'Magenta Candle', 'Magenta_Candle.png'),
(173, 'pink_candle', 'Pink Candle', 'Pink_Candle.png'),
(174, 'white_carpet', 'White Carpet', 'White_Carpet.png'),
(175, 'light_gray_carpet', 'Light Gray Carpet', 'Light_Gray_Carpet.png'),
(176, 'gray_carpet', 'Gray Carpet', 'Gray_Carpet.png'),
(177, 'black_carpet', 'Black Carpet', 'Black_Carpet.png'),
(178, 'brown_carpet', 'Brown Carpet', 'Brown_Carpet.png'),
(179, 'red_carpet', 'Red Carpet', 'Red_Carpet.png'),
(180, 'orange_carpet', 'Orange Carpet', 'Orange_Carpet.png'),
(181, 'yellow_carpet', 'Yellow Carpet', 'Yellow_Carpet.png'),
(182, 'lime_carpet', 'Lime Carpet', 'Lime_Carpet.png'),
(183, 'green_carpet', 'Green Carpet', 'Green_Carpet.png'),
(184, 'cyan_carpet', 'Cyan Carpet', 'Cyan_Carpet.png'),
(185, 'light_blue_carpet', 'Light Blue Carpet', 'Light_Blue_Carpet.png'),
(186, 'blue_carpet', 'Blue Carpet', 'Blue_Carpet.png'),
(187, 'purple_carpet', 'Purple Carpet', 'Purple_Carpet.png'),
(188, 'magenta_carpet', 'Magenta Carpet', 'Magenta_Carpet.png'),
(189, 'pink_carpet', 'Pink Carpet', 'Pink_Carpet.png'),
(190, 'white_shulker_box', 'White Shulker Box', 'White_Shulker_Box.png'),
(191, 'light_gray_shulker_box', 'Light Gray Shulker Box', 'Light_Gray_Shulker_Box.png'),
(192, 'gray_shulker_box', 'Gray Shulker Box', 'Gray_Shulker_Box.png'),
(193, 'black_shulker_box', 'Black Shulker Box', 'Black_Shulker_Box.png'),
(194, 'brown_shulker_box', 'Brown Shulker Box', 'Brown_Shulker_Box.png'),
(195, 'red_shulker_box', 'Red Shulker Box', 'Red_Shulker_Box.png'),
(196, 'orange_shulker_box', 'Orange Shulker Box', 'Orange_Shulker_Box.png'),
(197, 'yellow_shulker_box', 'Yellow Shulker Box', 'Yellow_Shulker_Box.png'),
(198, 'lime_shulker_box', 'Lime Shulker Box', 'Lime_Shulker_Box.png'),
(199, 'green_shulker_box', 'Green Shulker Box', 'Green_Shulker_Box.png'),
(200, 'cyan_shulker_box', 'Cyan Shulker Box', 'Cyan_Shulker_Box.png'),
(201, 'light_blue_shulker_box', 'Light Blue Shulker Box', 'Light_Blue_Shulker_Box.png'),
(202, 'blue_shulker_box', 'Blue Shulker Box', 'Blue_Shulker_Box.png'),
(203, 'purple_shulker_box', 'Purple Shulker Box', 'Purple_Shulker_Box.png'),
(204, 'magenta_shulker_box', 'Magenta Shulker Box', 'Magenta_Shulker_Box.png'),
(205, 'pink_shulker_box', 'Pink Shulker Box', 'Pink_Shulker_Box.png'),
(206, 'white_wool', 'White Wool', 'White_Wool.png'),
(207, 'light_gray_wool', 'Light Gray Wool', 'Light_Gray_Wool.png'),
(208, 'gray_wool', 'Gray Wool', 'Gray_Wool.png'),
(209, 'black_wool', 'Black Wool', 'Black_Wool.png'),
(210, 'brown_wool', 'Brown Wool', 'Brown_Wool.png'),
(211, 'red_wool', 'Red Wool', 'Red_Wool.png'),
(212, 'orange_wool', 'Orange Wool', 'Orange_Wool.png'),
(213, 'yellow_wool', 'Yellow Wool', 'Yellow_Wool.png'),
(214, 'lime_wool', 'Lime Wool', 'Lime_Wool.png'),
(215, 'green_wool', 'Green Wool', 'Green_Wool.png'),
(216, 'cyan_wool', 'Cyan Wool', 'Cyan_Wool.png'),
(217, 'light_blue_wool', 'Light Blue Wool', 'Light_Blue_Wool.png'),
(218, 'blue_wool', 'Blue Wool', 'Blue_Wool.png'),
(219, 'purple_wool', 'Purple Wool', 'Purple_Wool.png'),
(220, 'magenta_wool', 'Magenta Wool', 'Magenta_Wool.png'),
(221, 'pink_wool', 'Pink Wool', 'Pink_Wool.png'),
(222, 'compass', 'Compass', 'Compass.png'),
(223, 'composter', 'Composter', 'Composter.png'),
(224, 'white_concrete_powder', 'White Concrete Powder', 'White_Concrete_Powder.png'),
(225, 'light_gray_concrete_powder', 'Light Gray Concrete Powder', 'Light_Gray_Concrete_Powder.png'),
(226, 'gray_concrete_powder', 'Gray Concrete Powder', 'Gray_Concrete_Powder.png'),
(227, 'black_concrete_powder', 'Black Concrete Powder', 'Black_Concrete_Powder.png'),
(228, 'brown_concrete_powder', 'Brown Concrete Powder', 'Brown_Concrete_Powder.png'),
(229, 'red_concrete_powder', 'Red Concrete Powder', 'Red_Concrete_Powder.png'),
(230, 'orange_concrete_powder', 'Orange Concrete Powder', 'Orange_Concrete_Powder.png'),
(231, 'yellow_concrete_powder', 'Yellow Concrete Powder', 'Yellow_Concrete_Powder.png'),
(232, 'green_concrete_powder', 'Green Concrete Powder', 'Green_Concrete_Powder.png'),
(233, 'cyan_concrete_powder', 'Cyan Concrete Powder', 'Cyan_Concrete_Powder.png'),
(234, 'light_blue_concrete_powder', 'Light Blue Concrete Powder', 'Light_Blue_Concrete_Powder.png'),
(235, 'lime_concrete_powder', 'Lime Concrete Powder', 'Lime_Concrete_Powder.png'),
(236, 'blue_concrete_powder', 'Blue Concrete Powder', 'Blue_Concrete_Powder.png'),
(237, 'purple_concrete_powder', 'Purple Concrete Powder', 'Purple_Concrete_Powder.png'),
(238, 'magenta_concrete_powder', 'Magenta Concrete Powder', 'Magenta_Concrete_Powder.png'),
(239, 'pink_concrete_powder', 'Pink Concrete Powder', 'Pink_Concrete_Powder.png'),
(240, 'conduit', 'Conduit', 'Conduit.png'),
(241, 'cookie', 'Cookie', 'Cookie.png'),
(242, 'copper_bulb', 'Copper Bulb', 'Copper_Bulb.png'),
(243, 'exposed_copper_bulb', 'Exposed Copper Bulb', 'Exposed_Copper_Bulb.png'),
(244, 'weathered_copper_bulb', 'Weathered Copper Bulb', 'Weathered_Copper_Bulb.png'),
(245, 'oxidized_copper_bulb', 'Oxidized Copper Bulb', 'Oxidized_Copper_Bulb.png'),
(246, 'waxed_copper_bulb', 'Waxed Copper Bulb', 'Copper_Bulb.png'),
(247, 'waxed_exposed_copper_bulb', 'Waxed Exposed Copper Bulb', 'Exposed_Copper_Bulb.png'),
(248, 'waxed_weathered_copper_bulb', 'Waxed Weathered Copper Bulb', 'Weathered_Copper_Bulb.png'),
(249, 'waxed_oxidized_copper_bulb', 'Waxed Oxidized Copper Bulb', 'Oxidized_Copper_Bulb.png'),
(250, 'copper_door', 'Copper Door', 'Copper_Door.png'),
(251, 'copper_grate', 'Copper Grate', 'Copper_Grate.png'),
(252, 'exposed_copper_grate', 'Exposed Copper Grate', 'Exposed_Copper_Grate.png'),
(253, 'weathered_copper_grate', 'Weathered Copper Grate', 'Weathered_Copper_Grate.png'),
(254, 'oxidized_copper_grate', 'Oxidized Copper Grate', 'Oxidized_Copper_Grate.png'),
(255, 'waxed_copper_grate', 'Waxed Copper Grate', 'Copper_Grate.png'),
(256, 'waxed_exposed_copper_grate', 'Waxed Exposed Copper Grate', 'Exposed_Copper_Grate.png'),
(257, 'waxed_weathered_copper_grate', 'Waxed Weathered Copper Grate', 'Weathered_Copper_Grate.png'),
(258, 'waxed_oxidized_copper_grate', 'Waxed Oxidized Copper Grate', 'Oxidized_Copper_Grate.png'),
(259, 'copper_ingot', 'Copper Ingot', 'Copper_Ingot.png'),
(260, 'copper_trapdoor', 'Copper Trapdoor', 'Copper_Trapdoor.png'),
(261, 'crafter', 'Crafter', 'Crafter.png'),
(262, 'crafting_table', 'Crafting Table', 'Crafting_Table.png'),
(263, 'creaking_heart', 'Creaking Heart', 'Creaking_Heart.png'),
(264, 'crossbow', 'Crossbow', 'Crossbow.png'),
(265, 'cut_copper', 'Cut Copper', 'Cut_Copper.png'),
(266, 'exposed_cut_copper', 'Exposed Cut Copper', 'Exposed_Cut_Copper.png'),
(267, 'weathered_cut_copper', 'Weathered Cut Copper', 'Weathered_Cut_Copper.png'),
(268, 'oxidized_cut_copper', 'Oxidized Cut Copper', 'Oxidized_Cut_Copper.png'),
(269, 'waxed_cut_copper', 'Waxed Cut Copper', 'Cut_Copper.png'),
(270, 'waxed_exposed_cut_copper', 'Waxed Exposed Cut Copper', 'Exposed_Cut_Copper.png'),
(271, 'waxed_weathered_cut_copper', 'Waxed Weathered Cut Copper', 'Weathered_Cut_Copper.png'),
(272, 'waxed_oxidized_cut_copper', 'Waxed Oxidized Cut Copper', 'Oxidized_Cut_Copper.png'),
(273, 'cut_copper_slab', 'Cut Copper Slab', 'Cut_Copper_Slab.png'),
(274, 'exposed_cut_copper_slab', 'Exposed Cut Copper Slab', 'Exposed_Cut_Copper_Slab.png'),
(275, 'weathered_cut_copper_slab', 'Weathered Cut Copper Slab', 'Weathered_Cut_Copper_Slab.png'),
(276, 'oxidized_cut_copper_slab', 'Oxidized Cut Copper Slab', 'Oxidized_Cut_Copper_Slab.png'),
(277, 'waxed_cut_copper_slab', 'Waxed Cut Copper Slab', 'Cut_Copper_Slab.png'),
(278, 'waxed_exposed_cut_copper_slab', 'Waxed Exposed Cut Copper Slab', 'Exposed_Cut_Copper_Slab.png'),
(279, 'waxed_weathered_cut_copper_slab', 'Waxed Weathered Cut Copper Slab', 'Weathered_Cut_Copper_Slab.png'),
(280, 'waxed_oxidized_cut_copper_slab', 'Waxed Oxidized Cut Copper Slab', 'Oxidized_Cut_Copper_Slab.png'),
(281, 'cut_copper_stairs', 'Cut Copper Stairs', 'Cut_Copper_Stairs.png'),
(282, 'exposed_cut_copper_stairs', 'Exposed Cut Copper Stairs', 'Exposed_Cut_Copper_Stairs.png'),
(283, 'weathered_cut_copper_stairs', 'Weathered Cut Copper Stairs', 'Weathered_Cut_Copper_Stairs.png'),
(284, 'oxidized_cut_copper_stairs', 'Oxidized Cut Copper Stairs', 'Oxidized_Cut_Copper_Stairs.png'),
(285, 'waxed_cut_copper_stairs', 'Waxed Cut Copper Stairs', 'Cut_Copper_Stairs.png'),
(286, 'waxed_exposed_cut_copper_stairs', 'Waxed Exposed Cut Copper Stairs', 'Exposed_Cut_Copper_Stairs.png'),
(287, 'waxed_weathered_cut_copper_stairs', 'Waxed Weathered Cut Copper Stairs', 'Weathered_Cut_Copper_Stairs.png'),
(288, 'waxed_oxidized_cut_copper_stairs', 'Waxed Oxidized Cut Copper Stairs', 'Oxidized_Cut_Copper_Stairs.png'),
(289, 'cut_red_sandstone', 'Cut Red Sandstone', 'Cut_Red_Sandstone.png'),
(290, 'cut_sandstone', 'Cut Sandstone', 'Cut_Sandstone.png'),
(291, 'dark_prismarine', 'Dark Prismarine', 'Dark_Prismarine.png'),
(292, 'dark_prismarine_slab', 'Dark Prismarine Slab', 'Dark_Prismarine_Slab.png'),
(293, 'dark_prismarine_stairs', 'Dark Prismarine Stairs', 'Dark_Prismarine_Stairs.png'),
(294, 'daylight_detector', 'Daylight Detector', 'Daylight_Detector.png'),
(295, 'decorated_pot', 'Decorated Pot', 'Decorated_Pot.png'),
(296, 'deepslate_brick_slab', 'Deepslate Brick Slab', 'Deepslate_Brick_Slab.png'),
(297, 'deepslate_brick_stairs', 'Deepslate Brick Stairs', 'Deepslate_Brick_Stairs.png'),
(298, 'deepslate_brick_wall', 'Deepslate Brick Wall', 'Deepslate_Brick_Wall.png'),
(299, 'deepslate_bricks', 'Deepslate Bricks', 'Deepslate_Bricks.png'),
(300, 'deepslate_tile_slab', 'Deepslate Tile Slab', 'Deepslate_Tile_Slab.png'),
(301, 'deepslate_tile_stairs', 'Deepslate Tile Stairs', 'Deepslate_Tile_Stairs.png'),
(302, 'deepslate_tile_wall', 'Deepslate Tile Wall', 'Deepslate_Tile_Wall.png'),
(303, 'deepslate_tiles', 'Deepslate Tiles', 'Deepslate_Tiles.png'),
(304, 'detector_rail', 'Detector Rail', 'Detector_Rail.png'),
(305, 'diamond', 'Diamond', 'Diamond.png'),
(306, 'diorite', 'Diorite', 'Diorite.png'),
(307, 'diorite_slab', 'Diorite Slab', 'Diorite_Slab.png'),
(308, 'diorite_stairs', 'Diorite Stairs', 'Diorite_Stairs.png'),
(309, 'diorite_wall', 'Diorite Wall', 'Diorite_Wall.png'),
(310, 'dispenser', 'Dispenser', 'Dispenser.png'),
(311, 'dropper', 'Dropper', 'Dropper.png'),
(312, 'dripstone_block', 'Dripstone Block', 'Dripstone_Block.png'),
(313, 'white_dye', 'White Dye', 'White_Dye.png'),
(314, 'light_gray_dye', 'Light Gray Dye', 'Light_Gray_Dye.png'),
(315, 'gray_dye', 'Gray Dye', 'Gray_Dye.png'),
(316, 'black_dye', 'Black Dye', 'Black_Dye.png'),
(317, 'brown_dye', 'Brown Dye', 'Brown_Dye.png'),
(318, 'red_dye', 'Red Dye', 'Red_Dye.png'),
(319, 'orange_dye', 'Orange Dye', 'Orange_Dye.png'),
(320, 'yellow_dye', 'Yellow Dye', 'Yellow_Dye.png'),
(321, 'lime_dye', 'Lime Dye', 'Lime_Dye.png'),
(322, 'cyan_dye', 'Cyan Dye', 'Cyan_Dye.png'),
(323, 'light_blue_dye', 'Light Blue Dye', 'Light_Blue_Dye.png'),
(324, 'blue_dye', 'Blue Dye', 'Blue_Dye.png'),
(325, 'purple_dye', 'Purple Dye', 'Purple_Dye.png'),
(326, 'magenta_dye', 'Magenta Dye', 'Magenta_Dye.png'),
(327, 'pink_dye', 'Pink Dye', 'Pink_Dye.png'),
(328, 'emerald', 'emerald', 'Emerald.png'),
(329, 'empty_map', 'Empty Map', 'Empty_Map.png'),
(330, 'enchanting_table', 'Enchanting Table', 'Enchanting_Table.png'),
(331, 'end_crystal', 'End Crystal', 'End_Crystal.png'),
(332, 'end_rod', 'End Rod', 'End_Rod.png'),
(333, 'end_stone_brick_slab', 'End Stone Brick Slab', 'End_Stone_Brick_Slab.png'),
(334, 'end_stone_brick_wall', 'End Stone Brick Wall', 'End_Stone_Brick_Wall.png'),
(335, 'end_stone_bricks', 'End Stone Bricks', 'End_Stone_Bricks.png'),
(336, 'end_stone_brick_stairs', 'End Stone Brick Stairs', 'End_Stone_Brick_Stairs.png'),
(337, 'ender_chest', 'Ender Chest', 'Ender_Chest.png'),
(338, 'eye_of_ender', 'Eye of Ender', 'Eye_of_Ender.png'),
(339, 'fermented_spider_eye', 'Fermented Spider Eye', 'Fermented_Spider_Eye.png'),
(340, 'fire_charge', 'Fire Charge', 'Fire_Charge.png'),
(341, 'firework_rocket', 'Firework Rocket', 'Firework_Rocket.png'),
(342, 'firework_star', 'Firework Star', 'Firework_Star.png'),
(343, 'fishing_rod', 'Fishing Rod', 'Fishing_Rod.png'),
(344, 'fletching_table', 'Fletching Table', 'Fletching_Table.png'),
(345, 'flint_and_steel', 'Flint and Steel', 'Flint_and_Steel.png'),
(346, 'flower_pot', 'Flower Pot', 'Flower_Pot.png'),
(347, 'furnace', 'Furnace', 'Furnace.png'),
(348, 'brewing_stand', 'Brewing Stand', 'Brewing_Stand.png'),
(349, 'white_stained_glass', 'White Stained Glass', 'White_Stained_Glass.png'),
(350, 'light_gray_stained_glass', 'Light Gray Stained Glass', 'Light_Gray_Stained_Glass.png'),
(351, 'gray_stained_glass', 'Gray Stained Glass', 'Gray_Stained_Glass.png'),
(352, 'black_stained_glass', 'Black Stained Glass', 'Black_Stained_Glass.png'),
(353, 'brown_stained_glass', 'Brown Stained Glass', 'Brown_Stained_Glass.png'),
(354, 'red_stained_glass', 'Red Stained Glass', 'Red_Stained_Glass.png'),
(355, 'orange_stained_glass', 'Orange Stained Glass', 'Orange_Stained_Glass.png'),
(356, 'yellow_stained_glass', 'Yellow Stained Glass', 'Yellow_Stained_Glass.png'),
(357, 'lime_stained_glass', 'Lime Stained Glass', 'Lime_Stained_Glass.png'),
(358, 'green_stained_glass', 'Green Stained Glass', 'Green_Stained_Glass.png'),
(359, 'cyan_stained_glass', 'Cyan Stained Glass', 'Cyan_Stained_Glass.png'),
(360, 'light_blue_stained_glass', 'Light Blue Stained Glass', 'Light_Blue_Stained_Glass.png'),
(361, 'blue_stained_glass', 'Blue Stained Glass', 'Blue_Stained_Glass.png'),
(362, 'purple_stained_glass', 'Purple Stained Glass', 'Purple_Stained_Glass.png'),
(363, 'magenta_stained_glass', 'Magenta Stained Glass', 'Magenta_Stained_Glass.png'),
(364, 'pink_stained_glass', 'Pink Stained Glass', 'Pink_Stained_Glass.png'),
(365, 'glass_bottle', 'Glass Bottle', 'Glass_Bottle.png'),
(366, 'glass_pane', 'Glass Pane', 'Glass_Pane.png'),
(367, 'white_stained_glass_pane', 'White Stained Glass Pane', 'White_Stained_Glass_Pane.png'),
(368, 'light_gray_stained_glass_pane', 'Light Gray Stained Glass Pane', 'Light_Gray_Stained_Glass_Pane.png'),
(369, 'gray_stained_glass_pane', 'Gray Stained Glass Pane', 'Gray_Stained_Glass_Pane.png'),
(370, 'black_stained_glass_pane', 'Black Stained Glass Pane', 'Black_Stained_Glass_Pane.png'),
(371, 'brown_stained_glass_pane', 'Brown Stained Glass Pane', 'Brown_Stained_Glass_Pane.png'),
(372, 'red_stained_glass_pane', 'Red Stained Glass Pane', 'Red_Stained_Glass_Pane.png'),
(373, 'orange_stained_glass_pane', 'Orange Stained Glass Pane', 'Orange_Stained_Glass_Pane.png'),
(374, 'yellow_stained_glass_pane', 'Yellow Stained Glass Pane', 'Yellow_Stained_Glass_Pane.png'),
(375, 'lime_stained_glass_pane', 'Lime Stained Glass Pane', 'Lime_Stained_Glass_Pane.png'),
(376, 'green_stained_glass_pane', 'Green Stained Glass Pane', 'Green_Stained_Glass_Pane.png'),
(377, 'cyan_stained_glass_pane', 'Cyan Stained Glass Pane', 'Cyan_Stained_Glass_Pane.png'),
(378, 'light_blue_stained_glass_pane', 'Light Blue Stained Glass Pane', 'Light_Blue_Stained_Glass_Pane.png'),
(379, 'blue_stained_glass_pane', 'Blue Stained Glass Pane', 'Blue_Stained_Glass_Pane.png'),
(380, 'purple_stained_glass_pane', 'Purple Stained Glass Pane', 'Purple_Stained_Glass_Pane.png'),
(381, 'magenta_stained_glass_pane', 'Magenta Stained Glass Pane', 'Magenta_Stained_Glass_Pane.png'),
(382, 'pink_stained_glass_pane', 'Pink Stained Glass Pane', 'Pink_Stained_Glass_Pane.png'),
(383, 'glistering_melon_slice', 'Glistering Melon Slice', 'Glistering_Melon_Slice.png'),
(384, 'glow_item_frame', 'Glow Item Frame', 'Glow_Item_Frame.png'),
(385, 'glowstone', 'Glowstone', 'Glowstone.png'),
(386, 'gold_ingot', 'Gold Ingot', 'Gold_Ingot.png'),
(387, 'gold_nugget', 'Gold Nugget', 'Gold_Nugget.png'),
(388, 'golden_apple', 'Golden Apple', 'Golden_Apple.png'),
(389, 'golden_carrot', 'Golden Carrot', 'Golden_Carrot.png'),
(390, 'granite', 'Granite', 'Granite.png'),
(391, 'granite_slab', 'Granite Slab', 'Granite_Slab.png'),
(392, 'granite_stairs', 'Granite Stairs', 'Granite_Stairs.png'),
(393, 'granite_wall', 'Granite Wall', 'Granite_Wall.png'),
(394, 'grindstone', 'Grindstone', 'Grindstone.png'),
(395, 'oak_hanging_sign', 'Oak Hanging Sign', 'Oak_Hanging_Sign.png'),
(396, 'spruce_hanging_sign', 'Spruce Hanging Sign', 'Spruce_Hanging_Sign.png'),
(397, 'birch_hanging_sign', 'Birch Hanging Sign', 'Birch_Hanging_Sign.png'),
(398, 'jungle_hanging_sign', 'Jungle Hanging Sign', 'Jungle_Hanging_Sign.png'),
(399, 'acacia_hanging_sign', 'Acacia Hanging Sign', 'Acacia_Hanging_Sign.png'),
(400, 'dark_oak_hanging_sign', 'Dark Oak Hanging Sign', 'Dark_Oak_Hanging_Sign.png'),
(401, 'mangrove_hanging_sign', 'Mangrove Hanging Sign', 'Mangrove_Hanging_Sign.png'),
(402, 'cherry_hanging_sign', 'Cherry Hanging Sign', 'Cherry_Hanging_Sign.png'),
(403, 'pale_oak_hanging_sign', 'Pale Oak Hanging Sign', 'Pale_Oak_Hanging_Sign.png'),
(404, 'bamboo_hanging_sign', 'Bamboo Hanging Sign', 'Bamboo_Hanging_Sign.png'),
(405, 'crimson_hanging_sign', 'Crimson Hanging Sign', 'Crimson_Hanging_Sign.png'),
(406, 'warped_hanging_sign', 'Warped Hanging Sign', 'Warped_Hanging_Sign.png'),
(407, 'hay_bale', 'Hay Bale', 'Hay_Bale.png'),
(408, 'heavy_weighted_pressure_plate', 'Heavy Weighted Pressure Plate', 'Heavy_Weighted_Pressure_Plate.png'),
(409, 'leather_cap', 'Leather Cap', 'Leather_Cap.png'),
(410, 'iron_helmet', 'Iron Helmet', 'Iron_Helmet.png'),
(411, 'golden_helmet', 'Golden Helmet', 'Golden_Helmet.png'),
(412, 'diamond_helmet', 'Diamond Helmet', 'Diamond_Helmet.png'),
(413, 'turtle_shell', 'Turtle Shell', 'Turtle_Shell.png'),
(414, 'wooden_hoe', 'Wooden Hoe', 'Wooden_Hoe.png'),
(415, 'stone_hoe', 'Stone Hoe', 'Stone_Hoe.png'),
(416, 'iron_hoe', 'Iron Hoe', 'Iron_Hoe.png'),
(417, 'golden_hoe', 'Golden Hoe', 'Golden_Hoe.png'),
(418, 'diamond_hoe', 'Diamond Hoe', 'Diamond_Hoe.png'),
(419, 'honey_block', 'Honey Block', 'Honey_Block.png'),
(420, 'honey_bottle', 'Honey Bottle', 'Honey_Bottle.png'),
(421, 'honeycomb_block', 'Honeycomb Block', 'Honeycomb_Block.png'),
(422, 'hopper', 'Hopper', 'Hopper.png'),
(423, 'iron_bars', 'Iron Bars', 'Iron_Bars.png'),
(424, 'iron_door', 'Iron Door', 'Iron_Door.png'),
(425, 'iron_ingot', 'Iron Ingot', 'Iron_Ingot.png'),
(426, 'iron_nugget', 'Iron Nugget', 'Iron_Nugget.png'),
(427, 'iron_trapdoor', 'Iron Trapdoor', 'Iron_Trapdoor.png'),
(428, 'item_frame', 'Item Frame', 'Item_Frame.png'),
(429, 'jack_olantern', 'Jack o\'Lantern', 'Jack_oLantern.png'),
(430, 'jukebox', 'Jukebox', 'Jukebox.png'),
(431, 'ladder', 'Ladder', 'Ladder.png'),
(432, 'lantern', 'Lantern', 'Lantern.png'),
(433, 'lapis_lazuli', 'Lapis Lazuli', 'Lapis_Lazuli.png'),
(434, 'lead', 'Lead', 'Lead.png'),
(435, 'leather', 'Leather', 'Leather.png'),
(436, 'leather_horse_armor', 'Leather Horse Armor', 'Leather_Horse_Armor.png'),
(437, 'lectern', 'Lectern', 'Lectern.png'),
(438, 'leather_pants', 'Leather Pants', 'Leather_Pants.png'),
(439, 'iron_leggings', 'Iron Leggings', 'Iron_Leggings.png'),
(440, 'golden_leggings', 'Golden Leggings', 'Golden_Leggings.png'),
(441, 'diamond_leggings', 'Diamond Leggings', 'Diamond_Leggings.png'),
(442, 'lever', 'Lever', 'Lever.png'),
(443, 'light_weighted_pressure_plate', 'Light Weighted Pressure Plate', 'Light_Weighted_Pressure_Plate.png'),
(444, 'lightning_rod', 'Lightning Rod', 'Lightning_Rod.png'),
(445, 'lodestone', 'Lodestone', 'Lodestone.png'),
(446, 'loom', 'Loom', 'Loom.png'),
(447, 'mace', 'Mace', 'Mace.png'),
(448, 'magma_block', 'Dripstone Block', 'Magma_Block.png'),
(449, 'melon', 'Melon', 'Melon.png'),
(450, 'music_disc', 'Music Disc', 'Music_Disc.png'),
(451, 'minecart', 'Minecart', 'Minecart.png'),
(452, 'moss_carpet', 'Moss Carpet', 'Moss_Carpet.png'),
(453, 'pale_moss_carpet', 'Pale Moss Carpet', 'Pale_Moss_Carpet.png'),
(454, 'mossy_cobblestone', 'Mossy Cobblestone', 'Mossy_Cobblestone.png'),
(455, 'mossy_cobblestone_slab', 'Mossy Cobblestone Slab', 'Mossy_Cobblestone_Slab.png'),
(456, 'mossy_cobblestone_stairs', 'Mossy Cobblestone Stairs', 'Mossy_Cobblestone_Stairs.png'),
(457, 'mossy_cobblestone_wall', 'Mossy Cobblestone Wall', 'Mossy_Cobblestone_Wall.png'),
(458, 'cobblestone_wall', 'Cobblestone Wall', 'Cobblestone_Wall.png'),
(459, 'mossy_stone_brick_slab', 'Mossy Stone Brick Slab', 'Mossy_Stone_Brick_Slab.png'),
(460, 'mossy_stone_brick_stairs', 'Mossy Stone Brick Stairs', 'Mossy_Stone_Brick_Stairs.png'),
(461, 'mossy_stone_brick_wall', 'Mossy Stone Brick Wall', 'Mossy_Stone_Brick_Wall.png'),
(462, 'mossy_stone_bricks', 'Mossy Stone Bricks', 'Mossy_Stone_Bricks.png'),
(463, 'magma_cream', 'Magma Cream', 'Magma_Cream.png'),
(464, 'mud_brick_slab', 'Mud Brick Slab', 'Mud_Brick_Slab.png'),
(465, 'mud_brick_stairs', 'Mud Brick Stairs', 'Mud_Brick_Stairs.png'),
(466, 'mud_brick_wall', 'Mud Brick Wall', 'Mud_Brick_Wall.png'),
(467, 'mud_bricks', 'Mud Bricks', 'Mud_Bricks.png'),
(468, 'muddy_mangrove_roots', 'Muddy Mangrove Roots', 'Muddy_Mangrove_Roots.png'),
(469, 'mushroom_stew', 'Mushroom Stew', 'Mushroom_Stew.png'),
(470, 'nether_brick_fence', 'Nether Brick Fence', 'Nether_Brick_Fence.png'),
(471, 'nether_brick_slab', 'Nether Brick Slab', 'Nether_Brick_Slab.png'),
(472, 'nether_brick_stairs', 'Nether Brick Stairs', 'Nether_Brick_Stairs.png'),
(473, 'nether_brick_wall', 'Nether Brick Wall', 'Nether_Brick_Wall.png'),
(474, 'nether_bricks', 'Nether Bricks', 'Nether_Bricks.png'),
(475, 'nether_wart_block', 'Nether Wart Block', 'Nether_Wart_Block.png'),
(476, 'netherite_ingot', 'Netherite Ingot', 'Netherite_Ingot.png'),
(477, 'note_block', 'Note Block', 'Note_Block.png'),
(478, 'observer', 'Observer', 'Observer.png'),
(479, 'carrot_on_a_stick', 'Carrot on a Stick', 'Carrot_on_a_Stick.png'),
(480, 'warped_fungus_on_a_stick', 'Warped Fungus on a Stick', 'Warped_Fungus_on_a_Stick.png'),
(481, 'packed_ice', 'Packed Ice', 'Packed_Ice.png'),
(482, 'packed_mud', 'Packed Mud', 'Packed_Mud.png'),
(483, 'painting', 'Painting', 'Painting.png'),
(484, 'paper', 'Paper', 'Paper.png'),
(485, 'wooden_pickaxe', 'Wooden Pickaxe', 'Wooden_Pickaxe.png'),
(486, 'stone_pickaxe', 'Stone Pickaxe', 'Stone_Pickaxe.png'),
(487, 'iron_pickaxe', 'Iron Pickaxe', 'Iron_Pickaxe.png'),
(488, 'golden_pickaxe', 'Golden Pickaxe', 'Golden_Pickaxe.png'),
(489, 'diamond_pickaxe', 'Diamond Pickaxe', 'Diamond_Pickaxe.png'),
(490, 'piston', 'Piston', 'Piston.png'),
(491, 'oak_planks', 'Oak Planks', 'Oak_Planks.png'),
(492, 'spruce_planks', 'Spruce Planks', 'Spruce_Planks.png'),
(493, 'birch_planks', 'Birch Planks', 'Birch_Planks.png'),
(494, 'jungle_planks', 'Jungle Planks', 'Jungle_Planks.png'),
(495, 'acacia_planks', 'Acacia Planks', 'Acacia_Planks.png'),
(496, 'dark_oak_planks', 'Dark Oak Planks', 'Dark_Oak_Planks.png'),
(497, 'mangrove_planks', 'Mangrove Planks', 'Mangrove_Planks.png'),
(498, 'cherry_planks', 'Cherry Planks', 'Cherry_Planks.png'),
(499, 'pale_oak_planks', 'Pale Oak Planks', 'Pale_Oak_Planks.png'),
(500, 'bamboo_planks', 'Bamboo Planks', 'Bamboo_Planks.png'),
(501, 'crimson_planks', 'Crimson Planks', 'Crimson_Planks.png'),
(502, 'warped_planks', 'Warped Planks', 'Warped_Planks.png'),
(503, 'polished_andesite', 'Polished Andesite', 'Polished_Andesite.png'),
(504, 'polished_andesite_slab', 'Polished Andesite Slab', 'Polished_Andesite_Slab.png'),
(505, 'polished_andesite_stairs', 'Polished Andesite Stairs', 'Polished_Andesite_Stairs.png'),
(506, 'polished_basalt', 'Polished Basalt', 'Polished_Basalt.png'),
(507, 'polished_blackstone', 'Polished Blackstone', 'Polished_Blackstone.png'),
(508, 'polished_blackstone_brick_slab', 'Polished Blackstone Brick Slab', 'Polished_Blackstone_Brick_Slab.png'),
(509, 'polished_blackstone_brick_stairs', 'Polished Blackstone Brick Stairs', 'Polished_Blackstone_Brick_Stairs.png'),
(510, 'polished_blackstone_brick_wall', 'Polished Blackstone Brick Wall', 'Polished_Blackstone_Brick_Wall.png'),
(511, 'polished_blackstone_bricks', 'Polished Blackstone Bricks', 'Polished_Blackstone_Bricks.png'),
(512, 'polished_blackstone_button', 'Polished Blackstone Button', 'Polished_Blackstone_Button.png'),
(513, 'melon_seeds', 'Melon Seeds', 'Melon_Seeds.png'),
(514, 'dried_kelp', 'Dried Kelp', 'Dried_Kelp.png'),
(515, 'coal', 'Coal', 'Coal.png'),
(516, 'polished_blackstone_pressure_plate', 'Polished Blackstone Pressure Plate', 'Polished_Blackstone_Pressure_Plate.png'),
(517, 'polished_blackstone_slab', 'Polished Blackstone Slab', 'Polished_Blackstone_Slab.png'),
(518, 'polished_blackstone_stairs', 'Polished Blackstone Stairs', 'Blackstone_Stairs.png'),
(519, 'polished_blackstone_wall', 'Polished Blackstone Wall', 'Polished_Blackstone_Wall.png'),
(520, 'polished_deepslate', 'Polished Deepslate', 'Polished_Deepslate.png'),
(521, 'polished_deepslate_slab', 'Polished Deepslate Slab', 'Polished_Deepslate_Slab.png'),
(522, 'polished_deepslate_stairs', 'Polished Deepslate Stairs', 'Polished_Deepslate_Stairs.png'),
(523, 'polished_deepslate_wall', 'Polished Deepslate Wall', 'Polished_Deepslate_Wall.png'),
(524, 'polished_diorite', 'Polished Diorite', 'Polished_Diorite.png'),
(525, 'polished_diorite_slab', 'Polished Diorite Slab', 'Polished_Diorite_Slab.png'),
(526, 'polished_diorite_stairs', 'Polished Diorite Stairs', 'Polished_Diorite_Stairs.png'),
(527, 'polished_granite', 'Polished Granite', 'Polished_Granite.png'),
(528, 'polished_granite_slab', 'SPolished Granite Slab', 'Polished_Granite_Slab.png'),
(529, 'polished_granite_stairs', 'Polished Granite Stairs', 'Polished_Granite_Stairs.png'),
(530, 'polished_tuff', 'Polished Tuff', 'Polished_Tuff.png'),
(531, 'polished_tuff_slab', 'Polished Tuff Slab', 'Polished_Tuff_Slab.png'),
(532, 'polished_tuff_stairs', 'Polished Tuff Stairs', 'Polished_Tuff_Stairs.png'),
(533, 'polished_tuff_wall', 'Polished Tuff Wall', 'Polished_Tuff_Wall.png'),
(534, 'arrow_of_splashing', 'Arrow of Splashing', 'Arrow_of_Splashing.png'),
(535, 'tipped_arrow', 'Tipped Arrow', 'Arrow_of_Splashing.png'),
(536, 'arrow_of_night_vision', 'Arrow of Night Vision', 'Arrow_of_Night_Vision.png'),
(537, 'arrow_of_invisibility', 'Arrow of Invisibility', 'Arrow_of_Invisibility.png'),
(538, 'arrow_of_leaping', 'Arrow of Leaping', 'Arrow_of_Leaping.png'),
(539, 'arrow_of_fire_resistance', 'Arrow of Fire Resistance', 'Arrow_of_Fire_Resistance.png'),
(540, 'arrow_of_swiftness', 'Arrow of Swiftness', 'Arrow_of_Swiftness.png'),
(541, 'arrow_of_slowness', 'Arrow of Slowness', 'Arrow_of_Slowness.png'),
(542, 'arrow_of_the_turtle_master', 'Arrow of the Turtle Master', 'Arrow_of_the_Turtle_Master.png'),
(543, 'arrow_of_water_breathing', 'Arrow of Water Breathing', 'Arrow_of_Water_Breathing.png'),
(544, 'arrow_of_healing', 'Arrow of Healing', 'Arrow_of_Healing.png'),
(545, 'arrow_of_harming', 'Arrow of Harming', 'Arrow_of_Harming.png'),
(546, 'arrow_of_poison', 'Arrow of Poison', 'Arrow_of_Poison.png'),
(547, 'arrow_of_regeneration', 'Arrow of Regeneration', 'Arrow_of_Regeneration.png'),
(548, 'arrow_of_strength', 'Arrow of Strength', 'Arrow_of_Strength.png'),
(549, 'arrow_of_weakness', 'Arrow of Weakness', 'Arrow_of_Weakness.png'),
(550, 'arrow_of_luck', 'Arrow of Luck', 'Arrow_of_Luck.png'),
(551, 'arrow_of_slow_falling', 'Arrow of Slow Falling', 'Arrow_of_Slow_Falling.png'),
(552, 'arrow_of_wind_charging', 'Arrow of Wind Charging', 'Arrow_of_Wind_Charging.png'),
(553, 'arrow_of_weaving', 'Arrow of Weaving', 'Arrow_of_Weaving.png'),
(554, 'arrow_of_oozing', 'Arrow of Oozing', 'Arrow_of_Oozing.png'),
(555, 'arrow_of_infestation', 'Arrow of Infestation', 'Arrow_of_Infestation.png'),
(556, 'prismarine', 'Prismarine', 'Prismarine.png'),
(557, 'prismarine_brick_slab', 'Prismarine Brick Slab', 'Prismarine_Brick_Slab.png'),
(558, 'prismarine_brick_stairs', 'Prismarine Brick Stairs', 'Prismarine_Brick_Stairs.png'),
(559, 'prismarine_bricks', 'Prismarine Bricks', 'Prismarine_Bricks.png'),
(560, 'prismarine_slab', 'Prismarine Slab', 'Prismarine_Slab.png'),
(561, 'prismarine_stairs', 'Prismarine Stairs', 'Prismarine_Stairs.png'),
(562, 'prismarine_wall', 'Prismarine Wall', 'Prismarine_Wall.png'),
(563, 'pumpkin_pie', 'Pumpkin Pie', 'Pumpkin_Pie.png'),
(564, 'pumpkin_seeds', 'Pumpkin Seeds', 'Pumpkin_Seeds.png'),
(565, 'purpur_block', 'Purpur Block', 'Purpur_Block.png'),
(566, 'purpur_pillar', 'Purpur Pillar', 'Purpur_Pillar.png'),
(567, 'purpur_slab', 'Purpur Slab', 'Purpur_Slab.png'),
(568, 'purpur_stairs', 'Purpur Stairs', 'Purpur_Stairs.png'),
(569, 'quartz_bricks', 'Quartz Bricks', 'Quartz_Bricks.png'),
(570, 'quartz_pillar', 'Quartz Pillar', 'Quartz_Pillar.png'),
(571, 'quartz_slab', 'Quartz Slab', 'Quartz_Slab.png'),
(572, 'quartz_stairs', 'Quartz Stairs', 'Quartz_Stairs.png'),
(573, 'rabbit_stew', 'Rabbit Stew', 'Rabbit_Stew.png'),
(574, 'rail', 'Rail', 'Rail.png'),
(575, 'powered_rail', 'Powered Rail', 'Powered_Rail.png'),
(576, 'raw_copper', 'Raw Copper', 'Raw_Copper.png'),
(577, 'raw_gold', 'Raw Gold', 'Raw_Gold.png'),
(578, 'raw_iron', 'Raw Iron', 'Raw_Iron.png'),
(579, 'recovery_compass', 'Recovery Compass', 'Recovery_Compass.png'),
(580, 'red_nether_brick_slab', 'Red Nether Brick Slab', 'Red_Nether_Brick_Slab.png'),
(581, 'red_nether_brick_stairs', 'Red Nether Brick Stairs', 'Red_Nether_Brick_Stairs.png'),
(582, 'red_nether_brick_wall', 'Red Nether Brick Wall', 'Red_Nether_Brick_Wall.png'),
(583, 'red_nether_bricks', 'Red Nether Bricks', 'Red_Nether_Bricks.png'),
(584, 'red_sandstone', 'Red Sandstone', 'Red_Sandstone.png'),
(585, 'red_sandstone_slab', 'Red Sandstone Slab', 'Red_Sandstone_Slab.png'),
(586, 'red_sandstone_stairs', 'Red Sandstone Stairs', 'Red_Sandstone_Stairs.png'),
(587, 'red_sandstone_wall', 'Red Sandstone Wall', 'Red_Sandstone_Wall.png'),
(588, 'redstone_comparator', 'Redstone Comparator', 'Redstone_Comparator.png'),
(589, 'redstone_dust', 'Redstone Dust', 'Redstone_Dust.png'),
(590, 'redstone_lamp', 'Redstone Lamp', 'Redstone_Lamp.png'),
(591, 'redstone_repeater', 'Redstone Repeater', 'Redstone_Repeater.png'),
(592, 'redstone_torch', 'Redstone Torch', 'Redstone_Torch.png'),
(593, 'resin_clump', 'Resin Clump', 'Resin_Clump.png'),
(594, 'respawn_anchor', 'Respawn Anchor', 'Respawn_Anchor.png'),
(595, 'minecart_with_chest', 'Minecart with Chest', 'Minecart_with_Chest.png'),
(596, 'minecart_with_furnace', 'Minecart with Furnace', 'Minecart_with_Furnace.png'),
(597, 'minecart_with_tnt', 'Minecart with TNT', 'Minecart_with_TNT.png'),
(598, 'minecart_with_hopper', 'Minecart with Hopper', 'Minecart_with_Hopper.png'),
(599, 'sandstone', 'Sandstone', 'Sandstone.png'),
(600, 'sandstone_slab', 'Sandstone Slab', 'Sandstone_Slab.png'),
(601, 'sandstone_stairs', 'Sandstone Stairs', 'Sandstone_Stairs.png'),
(602, 'sandstone_wall', 'Sandstone Wall', 'Sandstone_Wall.png'),
(603, 'scaffolding', 'Scaffolding', 'Scaffolding.png'),
(604, 'sea_lantern', 'Sea Lantern', 'Sea_Lantern.png'),
(605, 'shears', 'Shears', 'Shears.png'),
(606, 'shield', 'Shield', 'Shield.png'),
(607, 'white_shield', 'White Shield', 'White_Shield.png'),
(608, 'orange_shield', 'Orange Shield', 'Orange_Shield.png'),
(609, 'magenta_shield', 'Magenta Shield', 'Magenta_Shield.png'),
(610, 'light_blue_shield', 'Light Blue Shield', 'Light_Blue_Shield.png'),
(611, 'yellow_shield', 'Yellow Shield', 'Yellow_Shield.png'),
(612, 'lime_shield', 'Lime Shield', 'Lime_Shield.png'),
(613, 'pink_shield', 'Pink Shield', 'Pink_Shield.png'),
(614, 'gray_shield', 'Gray Shield', 'Gray_Shield.png'),
(615, 'light_gray_shield', 'Light Gray Shield', 'Light_Gray_Shield.png'),
(616, 'cyan_shield', 'Cyan Shield', 'Cyan_Shield.png'),
(617, 'purple_shield', 'Purple Shield', 'Purple_Shield.png'),
(618, 'blue_shield', 'Blue Shield', 'Blue_Shield.png'),
(619, 'brown_shield', 'Brown Shield', 'Brown_Shield.png'),
(620, 'green_shield', 'Green Shield', 'Green_Shield.png'),
(621, 'red_shield', 'Red Shield', 'Red_Shield.png'),
(622, 'black_shield', 'Black Shield', 'Black_Shield.png'),
(623, 'wooden_shovel', 'Wooden Shovel', 'Wooden_Shovel.png'),
(624, 'stone_shovel', 'Stone Shovel', 'Stone_Shovel.png'),
(625, 'iron_shovel', 'Iron Shovel', 'Iron_Shovel.png'),
(626, 'golden_shovel', 'Golden Shovel', 'Golden_Shovel.png'),
(627, 'diamond_shovel', 'Diamond Shovel', 'Diamond_Shovel.png'),
(628, 'shulker_box', 'Shulker Box', 'Shulker_Box.png'),
(629, 'oak_sign', 'Oak Sign', 'Oak_Sign.png'),
(630, 'spruce_sign', 'Spruce Sign', 'Spruce_Sign.png'),
(631, 'birch_sign', 'Birch Sign', 'Birch_Sign.png'),
(632, 'jungle_sign', 'Jungle Sign', 'Jungle_Sign.png'),
(633, 'acacia_sign', 'Acacia Sign', 'Acacia_Sign.png'),
(634, 'dark_oak_sign', 'Dark Oak Sign', 'Dark_Oak_Sign.png'),
(635, 'mangrove_sign', 'Mangrove Sign', 'Mangrove_Sign.png'),
(636, 'cherry_sign', 'Cherry Sign', 'Cherry_Sign.png'),
(637, 'pale_oak_sign', 'Pale Oak Sign', 'Pale_Oak_Sign.png'),
(638, 'bamboo_sign', 'Bamboo Sign', 'Bamboo_Sign.png'),
(639, 'crimson_sign', 'Crimson Sign', 'Crimson_Sign.png'),
(640, 'warped_sign', 'Warped Sign', 'Warped_Sign.png'),
(641, 'slime_block', 'Slime Block', 'Slime_Block.png'),
(642, 'slimeball', 'Slimeball', 'Slimeball.png'),
(643, 'smithing_table', 'Smithing Table', 'Smithing_Table.png'),
(644, 'smoker', 'Smoker', 'Smoker.png'),
(645, 'smooth_quartz_slab', 'Smooth Quartz Slab', 'Smooth_Quartz_Slab.png'),
(646, 'smooth_quartz_stairs', 'Smooth Quartz Stairs', 'Smooth_Quartz_Stairs.png'),
(647, 'smooth_red_sandstone_slab', 'Smooth Red Sandstone Slab', 'Smooth_Red_Sandstone_Slab.png'),
(648, 'cut_red_sandstone_slab', 'Cut Red Sandstone Slab', 'Cut_Red_Sandstone_Slab.png'),
(649, 'smooth_sandstone_slab', 'Smooth Sandstone Slab', 'Smooth_Sandstone_Slab.png'),
(650, 'cut_sandstone_slab', 'Cut Sandstone Slab', 'Cut_Sandstone_Slab.png'),
(651, 'smooth_red_sandstone_stairs', 'Smooth Red Sandstone Stairs', 'Smooth_Red_Sandstone_Stairs.png'),
(652, 'smooth_sandstone_stairs', 'Smooth Sandstone Stairs', 'Smooth_Sandstone_Stairs.png'),
(653, 'smooth_stone_slab', 'Smooth Stone Slab', 'Smooth_Stone_Slab.png'),
(654, 'snow', 'Snow', 'Snow.png'),
(655, 'snow_block', 'Snow Block', 'Snow_Block.png'),
(656, 'soul_campfire', 'Soul Campfire', 'Soul_Campfire.png'),
(657, 'soul_lantern', 'Soul Lantern', 'Soul_Lantern.png'),
(658, 'soul_torch', 'Soul Torch', 'Soul_Torch.png'),
(659, 'spectral_arrow', 'Spectral Arrow', 'Spectral_Arrow.png'),
(660, 'spyglass', 'Spyglass', 'Spyglass.png'),
(661, 'stick', 'Stick', 'Stick.png'),
(662, 'sticky_piston', 'Sticky Piston', 'Sticky_Piston.png'),
(663, 'stone_brick_slab', 'Stone Brick Slab', 'Stone_Brick_Slab.png'),
(664, 'stone_brick_stairs', 'Stone Brick Stairs', 'Stone_Brick_Stairs.png'),
(665, 'stone_brick_wall', 'Stone Brick Wall', 'Stone_Brick_Wall.png'),
(666, 'stone_bricks', 'Stone Bricks', 'Stone_Bricks.png'),
(667, 'stone_button', 'Stone Button', 'Stone_Button.png'),
(668, 'stone_pressure_plate', 'Stone Pressure Plate', 'Stone_Pressure_Plate.png'),
(669, 'stone_slab', 'Stone Slab', 'Stone_Slab.png'),
(670, 'stone_stairs', 'Stone Stairs', 'Stone_Stairs.png'),
(671, 'stonecutter', 'Stonecutter', 'Stonecutter.png'),
(672, 'stripped_oak_wood', 'Stripped Oak Wood', 'Stripped_Oak_Wood.png'),
(673, 'stripped_spruce_wood', 'Stripped Spruce Wood', 'Stripped_Spruce_Wood.png'),
(674, 'stripped_birch_wood', 'Stripped Birch Wood', 'Stripped_Birch_Wood.png'),
(675, 'stripped_jungle_wood', 'Stripped Jungle Wood', 'Stripped_Jungle_Wood.png'),
(676, 'stripped_acacia_wood', 'Stripped Acacia Wood', 'Stripped_Acacia_Wood.png'),
(677, 'stripped_dark_oak_wood', 'Stripped Dark Oak Wood', 'Stripped_Dark_Oak_Wood.png'),
(678, 'stripped_mangrove_wood', 'Stripped Mangrove Wood', 'Stripped_Mangrove_Wood.png'),
(679, 'stripped_cherry_wood', 'Stripped Cherry Wood', 'Stripped_Cherry_Wood.png'),
(680, 'stripped_pale_oak_wood', 'Stripped Pale Oak Wood', 'Stripped_Pale_Oak_Wood.png'),
(681, 'stripped_crimson_hyphae', 'Stripped Crimson Hyphae', 'Stripped_Crimson_Hyphae.png'),
(682, 'stripped_warped_hyphae', 'Stripped Warped Hyphae', 'Stripped_Warped_Hyphae.png'),
(683, 'sugar', 'Sugar', 'Sugar.png'),
(684, 'suspicious_stew', 'Suspicious Stew', 'Suspicious_Stew.png'),
(685, 'resin_bricks', 'Resin_Bricks', 'Resin_Bricks.png'),
(686, 'chiseled_resin_bricks', 'Chiseled Resin Bricks', 'Chiseled_Resin_Bricks.png'),
(687, 'resin_brick_slab', 'Resin Brick Slab', 'Resin_Brick_Slab.png'),
(688, 'resin_brick_stairs', 'Resin Brick Stairs', 'Resin_Brick_Stairs.png'),
(689, 'resin_brick_wall', 'Resin Brick Wall', 'Resin_Brick_Wall.png'),
(690, 'bundle', 'Bundle', 'Bundle.png'),
(691, 'white_bundle', 'White Bundle', 'White_Bundle.png'),
(692, 'light_gray_bundle', 'Light Gray Bundle', 'Light_Gray_Bundle.png'),
(693, 'gray_bundle', 'Gray Bundle', 'Gray_Bundle.png'),
(694, 'black_bundle', 'Black Bundle', 'Black_Bundle.png'),
(695, 'brown_bundle', 'Brown Bundle', 'Brown_Bundle.png'),
(696, 'red_bundle', 'Red Bundle', 'Red_Bundle.png'),
(697, 'orange_bundle', 'Orange Bundle', 'Orange_Bundle.png'),
(698, 'yellow_bundle', 'Yellow Bundle', 'Yellow_Bundle.png'),
(699, 'lime_bundle', 'Lime Bundle', 'Lime_Bundle.png'),
(700, 'green_bundle', 'Green Bundle', 'Green_Bundle.png'),
(701, 'cyan_bundle', 'Cyan Bundle', 'Cyan_Bundle.png'),
(702, 'light_blue_bundle', 'Light Blue Bundle', 'Light_Blue_Bundle.png'),
(703, 'blue_bundle', 'Blue Bundle', 'Blue_Bundle.png'),
(704, 'purple_bundle', 'Purple Bundle', 'Purple_Bundle.png'),
(705, 'magenta_bundle', 'Magenta Bundle', 'Magenta_Bundle.png'),
(706, 'pink_bundle', 'Pink Bundle', 'Pink_Bundle.png'),
(707, 'wooden_sword', 'Wooden Sword', 'Wooden_Sword.png'),
(708, 'diamond_sword', 'Diamond Sword', 'Diamond_Sword.png'),
(709, 'golden_sword', 'Golden Sword', 'Golden_Sword.png'),
(710, 'iron_sword', 'Iron Sword', 'Iron_Sword.png'),
(711, 'stone_sword', 'Stone Sword', 'Stone_Sword.png'),
(712, 'target', 'Target', 'Target.png'),
(713, 'bolt_armor_trim', 'Smithing Template', 'Bolt_Armor_Trim.png'),
(714, 'dune_armor_trim', 'Smithing Template', 'Dune_Armor_Trim.png'),
(715, 'eye_armor_trim', 'Smithing Template', 'Eye_Armor_Trim.png'),
(716, 'flow_armor_trim', 'Smithing Template', 'Flow_Armor_Trim.png'),
(717, 'host_armor_trim', 'Smithing Template', 'Host_Armor_Trim.png'),
(718, 'wayfinder_armor_trim', 'Smithing Template', 'Wayfinder_Armor_Trim.png'),
(719, 'raiser_armor_trim', 'Smithing Template', 'Raiser_Armor_Trim.png'),
(720, 'shaper_armor_trim', 'Smithing Template', 'Shaper_Armor_Trim.png'),
(721, 'coast_armor_trim', 'Smithing Template', 'Coast_Armor_Trim.png'),
(722, 'vex_armor_trim', 'Smithing Template', 'Vex_Armor_Trim.png'),
(723, 'sentry_armor_trim', 'Smithing Template', 'Sentry_Armor_Trim.png'),
(724, 'wild_armor_trim', 'Smithing Template', 'Wild_Armor_Trim.png'),
(725, 'ward_armor_trim', 'Smithing Template', 'Ward_Armor_Trim.png'),
(726, 'silence_armor_trim', 'Smithing Template', 'Silence_Armor_Trim.png'),
(727, 'tide_armor_trim', 'Smithing Template', 'Tide_Armor_Trim.png'),
(728, 'snout_armor_trim', 'Smithing Template', 'Snout_Armor_Trim.png'),
(729, 'rib_armor_trim', 'Smithing Template', 'Rib_Armor_Trim.png'),
(730, 'spire_armor_trim', 'Smithing Template', 'Spire_Armor_Trim.png'),
(731, 'netherite_upgrade', 'Smithing Template', 'Netherite_Upgrade.png'),
(732, 'white_terracotta', 'White Terracotta', 'White_Terracotta.png'),
(733, 'light_gray_terracotta', 'Light Gray Terracotta', 'Light_Gray_Terracotta.png'),
(734, 'gray_terracotta', 'Gray Terracotta', 'Gray_Terracotta.png'),
(735, 'black_terracotta', 'Black Terracotta', 'Black_Terracotta.png'),
(736, 'brown_terracotta', 'Brown Terracotta', 'Brown_Terracotta.png'),
(737, 'red_terracotta', 'Red Terracotta', 'Red_Terracotta.png'),
(738, 'orange_terracotta', 'Orange Terracotta', 'Orange_Terracotta.png'),
(739, 'yellow_terracotta', 'Yellow Terracotta', 'Yellow_Terracotta.png'),
(740, 'lime_terracotta', 'Lime Terracotta', 'Lime_Terracotta.png'),
(741, 'green_terracotta', 'Green Terracotta', 'Green_Terracotta.png'),
(742, 'cyan_terracotta', 'Cyan Terracotta', 'Cyan_Terracotta.png'),
(743, 'light_blue_terracotta', 'Light Blue Terracotta', 'Light_Blue_Terracotta.png'),
(744, 'blue_terracotta', 'Blue Terracotta', 'Blue_Terracotta.png'),
(745, 'purple_terracotta', 'Purple Terracotta', 'Purple_Terracotta.png'),
(746, 'magenta_terracotta', 'Magenta Terracotta', 'Magenta_Terracotta.png'),
(747, 'pink_terracotta', 'Pink Terracotta', 'Pink_Terracotta.png'),
(748, 'tined_glass', 'Tinted Glass', 'Tinted_Glass.png'),
(749, 'tnt', 'TNT', 'TNT.png'),
(750, 'torch', 'Torch', 'Torch.png'),
(751, 'trapped_chest', 'Trapped Chest', 'Trapped_Chest.png'),
(752, 'tripwire_hook', 'Tripwire Hook', 'Tripwire_Hook.png'),
(753, 'tuff_brick_slab', 'Tuff Brick Slab', 'Tuff_Brick_Slab.png');
INSERT INTO `collections` (`id`, `item_id`, `name`, `image`) VALUES
(754, 'tuff_brick_stairs', 'Tuff Brick Stairs', 'Tuff_Brick_Stairs.png'),
(755, 'tuff_brick_wall', 'Tuff Brick Wall', 'Tuff_Brick_Wall.png'),
(756, 'tuff_bricks', 'Tuff Bricks', 'Tuff_Bricks.png'),
(757, 'tuff_slab', 'Tuff Slab', 'Tuff_Slab.png'),
(758, 'tuff_stairs', 'Tuff Stairs', 'Tuff_Stairs.png'),
(759, 'tuff_wall', 'Tuff Wall', 'Tuff_Wall.png'),
(760, 'waxed_block_of_copper', 'Waxed Block of Copper', 'Block_of_Copper.png'),
(761, 'waxed_exposed_copper', 'Waxed Exposed Copper', 'Exposed_Copper.png'),
(762, 'waxed_weathered_copper', 'Waxed Weathered Copper', 'Weathered_Copper.png'),
(763, 'waxed_oxidized_copper', 'Waxed Oxidized Copper', 'Oxidized_Copper.png'),
(764, 'waxed_copper_door', 'Waxed Copper Door', 'Copper_Door.png'),
(765, 'waxed_weathered_copper_door', 'Waxed Weathered Copper Door', 'Weathered_Copper_Door.png'),
(766, 'waxed_oxidized_copper_door', 'Waxed Oxidized Copper Door', 'Oxidized_Copper_Door.png'),
(767, 'waxed_exposed_copper_door', 'Waxed Exposed Copper Door', 'Exposed_Copper_Door.png'),
(768, 'waxed_copper_trapdoor', 'Waxed Copper Trapdoor', 'Copper_Trapdoor.png'),
(769, 'waxed_weathered_copper_trapdoor', 'Waxed Weathered Copper Trapdoor', 'Weathered_Copper_Trapdoor.png'),
(770, 'waxed_oxidized_copper_trapdoor', 'Waxed Oxidized Copper Trapdoor', 'Oxidized_Copper_Trapdoor.png'),
(771, 'waxed_exposed_copper_trapdoor', 'Waxed Exposed Copper Trapdoor', 'Exposed_Copper_Trapdoor.png'),
(772, 'wheat', 'Wheat', 'Wheat.png'),
(773, 'wind_charge', 'Wind Charge', 'Wind_Charge.png'),
(774, 'wolf_armor', 'Wolf Armor', 'Wolf_Armor.png'),
(775, 'oak_wood', 'Oak Wood', 'Oak_Wood.png'),
(776, 'spruce_wood', 'Spruce Wood', 'Spruce_Wood.png'),
(777, 'birch_wood', 'Birch Wood', 'Birch_Wood.png'),
(778, 'jungle_wood', 'Jungle Wood', 'Jungle_Wood.png'),
(779, 'acacia_wood', 'Acacia Wood', 'Acacia_Wood.png'),
(780, 'dark_oak_wood', 'Dark Oak Wood', 'Dark_Oak_Wood.png'),
(781, 'mangrove_wood', 'Mangrove Wood', 'Mangrove_Wood.png'),
(782, 'cherry_wood', 'Cherry Wood', 'Cherry_Wood.png'),
(783, 'pale_oak_wood', 'Pale Oak Wood', 'Pale_Oak_Wood.png'),
(784, 'crimson_hyphae', 'Crimson Hyphae', 'Crimson_Hyphae.png'),
(785, 'warped_hyphae', 'Warped Hyphae', 'Warped_Hyphae.png'),
(786, 'oak_button', 'Oak Button', 'Oak_Button.png'),
(787, 'spruce_button', 'Spruce Button', 'Spruce_Button.png'),
(788, 'birch_button', 'Birch Button', 'Birch_Button.png'),
(789, 'jungle_button', 'Jungle Button', 'Jungle_Button.png'),
(790, 'acacia_button', 'Acacia Button', 'Acacia_Button.png'),
(791, 'dark_oak_button', 'Dark Oak Button', 'Dark_Oak_Button.png'),
(792, 'mangrove_button', 'Mangrove Button', 'Mangrove_Button.png'),
(793, 'cherry_button', 'Cherry Button', 'Cherry_Button.png'),
(794, 'pale_oak_button', 'Pale Oak Button', 'Pale_Oak_Button.png'),
(795, 'crimson_button', 'Crimson Button', 'Crimson_Button.png'),
(796, 'warped_button', 'Warped Button', 'Warped_Button.png'),
(797, 'bamboo_button', 'Bamboo Button', 'Bamboo_Button.png'),
(798, 'oak_door', 'Oak Door', 'Oak_Door.png'),
(799, 'spruce_door', 'Spruce Door', 'Spruce_Door.png'),
(800, 'birch_door', 'Birch Door', 'Birch_Door.png'),
(801, 'jungle_door', 'Jungle Door', 'Jungle_Door.png'),
(802, 'acacia_door', 'Acacia Door', 'Acacia_Door.png'),
(803, 'dark_oak_door', 'Dark Oak Door', 'Dark_Oak_Door.png'),
(804, 'mangrove_door', 'Mangrove Door', 'Mangrove_Door.png'),
(805, 'cherry_door', 'Cherry Door', 'Cherry_Door.png'),
(806, 'pale_oak_door', 'Pale Oak Door', 'Pale_Oak_Door.png'),
(807, 'bamboo_door', 'Bamboo Door', 'Bamboo_Door.png'),
(808, 'crimson_door', 'Crimson Door', 'Crimson_Door.png'),
(809, 'warped_door', 'Warped Door', 'Warped_Door.png'),
(810, 'oak_fence', 'Oak Fence', 'Oak_Fence.png'),
(811, 'spruce_fence', 'Spruce Fence', 'Spruce_Fence.png'),
(812, 'birch_fence', 'Birch Fence', 'Birch_Fence.png'),
(813, 'jungle_fence', 'Jungle Fence', 'Jungle_Fence.png'),
(814, 'acacia_fence', 'Acacia Fence', 'Acacia_Fence.png'),
(815, 'dark_oak_fence', 'Dark Oak Fence', 'Dark_Oak_Fence.png'),
(816, 'mangrove_fence', 'Mangrove Fence', 'Mangrove_Fence.png'),
(817, 'cherry_fence', 'Cherry Fence', 'Cherry_Fence.png'),
(818, 'pale_oak_fence', 'Pale Oak Fence', 'Pale_Oak_Fence.png'),
(819, 'bamboo_fence', 'Bamboo Fence', 'Bamboo_Fence.png'),
(820, 'crimson_fence', 'Crimson Fence', 'Crimson_Fence.png'),
(821, 'warped_fence', 'Warped Fence', 'Warped_Fence.png'),
(822, 'oak_fence_gate', 'Oak Fence Gate', 'Oak_Fence_Gate.png'),
(823, 'spruce_fence_gate', 'Spruce Fence Gate', 'Spruce_Fence_Gate.png'),
(824, 'birch_fence_gate', 'Birch Fence Gate', 'Birch_Fence_Gate.png'),
(825, 'jungle_fence_gate', 'Jungle Fence Gate', 'Jungle_Fence_Gate.png'),
(826, 'acacia_fence_gate', 'Acacia Fence Gate', 'Acacia_Fence_Gate.png'),
(827, 'dark_oak_fence_gate', 'Dark Oak Fence Gate', 'Dark_Oak_Fence_Gate.png'),
(828, 'mangrove_fence_gate', 'Mangrove Fence Gate', 'Mangrove_Fence_Gate.png'),
(829, 'cherry_fence_gate', 'Cherry Fence Gate', 'Cherry_Fence_Gate.png'),
(830, 'pale_oak_fence_gate', 'Pale_oak Fence Gate', 'Pale_Oak_Fence_Gate.png'),
(831, 'bamboo_fence_gate', 'Bamboo Fence Gate', 'Bamboo_Fence_Gate.png'),
(832, 'crimson_fence_gate', 'Crimson Fence Gate', 'Crimson_Fence_Gate.png'),
(833, 'warped_fence_gate', 'Warped Fence Gate', 'Warped_Fence_Gate.png'),
(834, 'oak_pressure_plate', 'Oak Pressure Plate', 'Oak_Pressure_Plate.png'),
(835, 'spruce_pressure_plate', 'Spruce Pressure Plate', 'Spruce_Pressure_Plate.png'),
(836, 'birch_pressure_plate', 'Birch Pressure Plate', 'Birch_Pressure_Plate.png'),
(837, 'jungle_pressure_plate', 'Jungle Pressure Plate', 'Jungle_Pressure_Plate.png'),
(838, 'acacia_pressure_plate', 'Acacia Pressure Plate', 'Acacia_Pressure_Plate.png'),
(839, 'dark_oak_pressure_plate', 'Dark Oak Pressure Plate', 'Dark_Oak_Pressure_Plate.png'),
(840, 'mangrove_pressure_plate', 'Mangrove Pressure Plate', 'Mangrove_Pressure_Plate.png'),
(841, 'cherry_pressure_plate', 'Cherry Pressure Plate', 'Cherry_Pressure_Plate.png'),
(842, 'pale_oak_pressure_plate', 'Pale Oak Pressure Plate', 'Pale_Oak_Pressure_Plate.png'),
(843, 'bamboo_pressure_plate', 'Bamboo Pressure Plate', 'Bamboo_Pressure_Plate.png'),
(844, 'crimson_pressure_plate', 'Crimson Pressure Plate', 'Crimson_Pressure_Plate.png'),
(845, 'warped_pressure_plate', 'Warped Pressure Plate', 'Warped_Pressure_Plate.png'),
(846, 'oak_slab', 'Oak Slab', 'Oak_Slab.png'),
(847, 'spruce_slab', 'Spruce Slab', 'Spruce_Slab.png'),
(848, 'birch_slab', 'Birch Slab', 'Birch_Slab.png'),
(849, 'jungle_slab', 'Jungle Slab', 'Jungle_Slab.png'),
(850, 'acacia_slab', 'Acacia Slab', 'Acacia_Slab.png'),
(851, 'dark_oak_slab', 'Dark Oak Slab', 'Dark_Oak_Slab.png'),
(852, 'mangrove_slab', 'Mangrove Slab', 'Mangrove_Slab.png'),
(853, 'cherry_slab', 'Cherry Slab', 'Cherry_Slab.png'),
(854, 'pale_oak_slab', 'Pale Oak Slab', 'Pale_Oak_Slab.png'),
(855, 'bamboo_slab', 'Bamboo Slab', 'Bamboo_Slab.png'),
(856, 'crimson_slab', 'Crimson Slab', 'Crimson_Slab.png'),
(857, 'warped_slab', 'Warped Slab', 'Warped_Slab.png'),
(858, 'oak_stairs', 'Oak Stairs', 'Oak_Stairs.png'),
(859, 'spruce_stairs', 'Spruce Stairs', 'Spruce_Stairs.png'),
(860, 'birch_stairs', 'Birch Stairs', 'Birch_Stairs.png'),
(861, 'jungle_stairs', 'Jungle Stairs', 'Jungle_Stairs.png'),
(862, 'acacia_stairs', 'Acacia Stairs', 'Acacia_Stairs.png'),
(863, 'dark_oak_stairs', 'Dark Oak Stairs', 'Dark_Oak_Stairs.png'),
(864, 'mangrove_stairs', 'Mangrove Stairs', 'Mangrove_Stairs.png'),
(865, 'cherry_stairs', 'Cherry Stairs', 'Cherry_Stairs.png'),
(866, 'pale_oak_stairs', 'Pale Oak Stairs', 'Pale_Oak_Stairs.png'),
(867, 'bamboo_stairs', 'Bamboo Stairs', 'Bamboo_Stairs.png'),
(868, 'crimson_stairs', 'Crimson Stairs', 'Crimson_Stairs.png'),
(869, 'warped_stairs', 'Warped Stairs', 'Warped_Stairs.png'),
(870, 'oak_trapdoor', 'Oak Trapdoor', 'Oak_Trapdoor.png'),
(871, 'spruce_trapdoor', 'Spruce Trapdoor', 'Spruce_Trapdoor.png'),
(872, 'birch_trapdoor', 'Birch Trapdoor', 'Birch_Trapdoor.png'),
(873, 'jungle_trapdoor', 'Jungle Trapdoor', 'Jungle_Trapdoor.png'),
(874, 'acacia_trapdoor', 'Acacia Trapdoor', 'Acacia_Trapdoor.png'),
(875, 'dark_oak_trapdoor', 'Dark Oak Trapdoor', 'Dark_Oak_Trapdoor.png'),
(876, 'mangrove_trapdoor', 'Mangrove Trapdoor', 'Mangrove_Trapdoor.png'),
(877, 'cherry_trapdoor', 'Cherry Trapdoor', 'Cherry_Trapdoor.png'),
(878, 'pale_oak_trapdoor', 'Pale_Oak Trapdoor', 'Pale_Oak_Trapdoor.png'),
(879, 'bamboo_trapdoor', 'Bamboo Trapdoor', 'Bamboo_Trapdoor.png'),
(880, 'crimson_trapdoor', 'Crimson Trapdoor', 'Crimson_Trapdoor.png'),
(881, 'warped_trapdoor', 'Warped Trapdoor', 'Warped_Trapdoor.png'),
(882, 'netherite_shovel', 'Netherite Shovel', 'Netherite_Shovel.png'),
(883, 'netherite_pickaxe', 'Netherite Pickaxe', 'Netherite_Pickaxe.png'),
(884, 'netherite_hoe', 'Netherite Hoe', 'Netherite_Hoe.png'),
(885, 'netherite_axe', 'Netherite Axe', 'Netherite_Axe.png'),
(886, 'netherite_sword', 'Netherite Sword', 'Netherite_Sword.png'),
(887, 'elytra', 'Elytra', 'Elytra.png'),
(888, 'trident', 'Trident', 'Trident.png'),
(889, 'chainmail_helmet', 'Chainmail Helmet', 'Chainmail_Helmet.png'),
(890, 'chainmail_chestplate', 'Chainmail Chestplate', 'Chainmail_Chestplate.png'),
(891, 'chainmail_leggings', 'Chainmail Leggings', 'Chainmail_Leggings.png'),
(892, 'chainmail_boots', 'Chainmail Boots', 'Chainmail_Boots.png'),
(893, 'netherite_helmet', 'Netherite Helmet', 'Netherite_Helmet.png'),
(894, 'netherite_chestplate', 'Netherite Chestplate', 'Netherite_Chestplate.png'),
(895, 'netherite_leggings', 'Netherite Leggings', 'Netherite_Leggings.png'),
(896, 'netherite_boots', 'Netherite Boots', 'Netherite_Boots.png'),
(897, 'diamond_horse_armor', 'Diamond Horse Armor', 'Diamond_Horse_Armor.png'),
(898, 'golden_horse_armor', 'Golden Horse Armor', 'Golden_Horse_Armor.png'),
(899, 'iron_horse_armor', 'Iron Horse Armor', 'Iron_Horse_Armor.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `controls`
--

CREATE TABLE `controls` (
  `id` int(11) NOT NULL,
  `settings` int(11) NOT NULL,
  `is_tap_mode` tinyint(1) NOT NULL DEFAULT 0,
  `copy` varchar(3) NOT NULL DEFAULT 'LMB',
  `remove` varchar(3) NOT NULL DEFAULT 'RMB'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `crafting_table_slots`
--

CREATE TABLE `crafting_table_slots` (
  `tip` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `difficulties`
--

CREATE TABLE `difficulties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color_code` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `difficulties`
--

INSERT INTO `difficulties` (`id`, `name`, `color_code`) VALUES
(1, 'Beginner', '55FF55'),
(2, 'Easy', '00AA00'),
(3, 'Normal', 'FFFF55'),
(4, 'Hard', 'FFAA00'),
(5, 'Insane', 'AA0000');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gamemodes`
--

CREATE TABLE `gamemodes` (
  `id` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `difficulty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `gamemodes`
--

INSERT INTO `gamemodes` (`id`, `icon`, `name`, `description`, `difficulty`) VALUES
(1, 'Tutorial.png', 'Tutorial', 'In this mode, players can learn the game\'s mechanics and controls.', 1),
(2, 'Classic.png', 'Classic', 'In this mode, you receive recipes as riddles, but only those that are not made by one type of material. Four different hints are available to help you solve them.', 3),
(3, 'Daily.png', 'Daily', 'Similar to Classic, but can only be played once per day. Keep your streak going!', 3),
(4, 'All_in_One.png', 'All in One', 'In this mode, you can receive any recipe as a riddle. Four different hints are available to help you solve it.', 4),
(5, 'Pocket.png', 'Pocket', 'Similar to All in One, but you must work with a 2x2 crafting table to solve the riddles.', 3),
(6, 'Resource.png', 'Resource', 'Similar to Classic, but with a limited supply of materials.', 2),
(7, 'Hardcore.png', 'Hardcore', 'Similar to Classic, but no hints are available, and the game is played with health points.', 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `player` int(11) NOT NULL,
  `riddle` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `is_solved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `guess_types`
--

CREATE TABLE `guess_types` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `guess_types`
--

INSERT INTO `guess_types` (`id`, `type`) VALUES
(1, 'Correct'),
(2, 'Semi-Correct'),
(3, 'Wrong');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `hints`
--

CREATE TABLE `hints` (
  `game` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `inventories_items`
--

CREATE TABLE `inventories_items` (
  `game` int(11) NOT NULL,
  `item` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `item_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `items`
--

INSERT INTO `items` (`id`, `item_id`, `name`, `src`) VALUES
(1, 'oak_log', 'Oak Log', 'Oak_Log.png'),
(2, 'oak_wood', 'Oak Wood', 'Oak_Wood.png'),
(3, 'stripped_oak_log', 'Stripped Oak Log', 'Stripped_Oak_Log.png'),
(4, 'stripped_oak_wood', 'Stripped Oak Wood', 'Stripped_Oak_Wood.png'),
(5, 'oak_planks', 'Oak Planks', 'Oak_Planks.png'),
(6, 'oak_slab', 'Oak Slab', 'Oak_Slab.png'),
(7, 'spruce_log', 'Spruce Log', 'Spruce_Log.png'),
(8, 'spruce_wood', 'Spruce Wood', 'Spruce_Wood.png'),
(9, 'stripped_spruce_log', 'Stripped Spruce Log', 'Stripped_Spruce_Log.png'),
(10, 'stripped_spruce_wood', 'Stripped Spruce Wood', 'Stripped_Spruce_Wood.png'),
(11, 'spruce_planks', 'Spruce Planks', 'Spruce_Planks.png'),
(12, 'spruce_slab', 'Spruce Slab', 'Spruce_Slab.png'),
(13, 'birch_log', 'Birch Log', 'Birch_Log.png'),
(14, 'birch_wood', 'Birch Wood', 'Birch_Wood.png'),
(15, 'stripped_birch_log', 'Stripped Birch Log', 'Stripped_Birch_Log.png'),
(16, 'stripped_birch_wood', 'Stripped Birch Wood', 'Stripped_Birch_Wood.png'),
(17, 'birch_planks', 'Birch Planks', 'Birch_Planks.png'),
(18, 'birch_slab', 'Birch Slab', 'Birch_Slab.png'),
(19, 'jungle_log', 'Jungle Log', 'Jungle_Log.png'),
(20, 'jungle_wood', 'Jungle Wood', 'Jungle_Wood.png'),
(21, 'stripped_jungle_log', 'Stripped Jungle Log', 'Stripped_Jungle_Log.png'),
(22, 'stripped_jungle_wood', 'Stripped Jungle Wood', 'Stripped_Jungle_Wood.png'),
(23, 'jungle_planks', 'Jungle Planks', 'Jungle_Planks.png'),
(24, 'jungle_slab', 'Jungle Slab', 'Jungle_Slab.png'),
(25, 'acacia_log', 'Acacia Log', 'Acacia_Log.png'),
(26, 'acacia_wood', 'Acacia Wood', 'Acacia_Wood.png'),
(27, 'stripped_acacia_log', 'Stripped Acacia Log', 'Stripped_Acacia_Log.png'),
(28, 'stripped_acacia_wood', 'Stripped Acacia Wood', 'Stripped_Acacia_Wood.png'),
(29, 'acacia_planks', 'Acacia Planks', 'Acacia_Planks.png'),
(30, 'acacia_slab', 'Acacia Slab', 'Acacia_Slab.png'),
(31, 'dark_oak_log', 'Dark Oak Log', 'Dark_Oak_Log.png'),
(32, 'dark_oak_wood', 'Dark Oak Wood', 'Dark_Oak_Wood.png'),
(33, 'stripped_dark_oak_log', 'Stripped Dark Oak Log', 'Stripped_Dark_Oak_Log.png'),
(34, 'stripped_dark_oak_wood', 'Stripped Dark Oak Wood', 'Stripped_Dark_Oak_Wood.png'),
(35, 'dark_oak_planks', 'Dark Oak Planks', 'Dark_Oak_Planks.png'),
(36, 'dark_oak_slab', 'Dark Oak Slab', 'Dark_Oak_Slab.png'),
(37, 'mangrove_log', 'Mangrove Log', 'Mangrove_Log.png'),
(38, 'mangrove_wood', 'Mangrove Wood', 'Mangrove_Wood.png'),
(39, 'stripped_mangrove_log', 'Stripped Mangrove Log', 'Stripped_Mangrove_Log.png'),
(40, 'stripped_mangrove_wood', 'Stripped Mangrove Wood', 'Stripped_Mangrove_Wood.png'),
(41, 'mangrove_planks', 'Mangrove Planks', 'Mangrove_Planks.png'),
(42, 'mangrove_slab', 'Mangrove Slab', 'Mangrove_Slab.png'),
(43, 'cherry_log', 'Cherry Log', 'Cherry_Log.png'),
(44, 'cherry_wood', 'Cherry Wood', 'Cherry_Wood.png'),
(45, 'stripped_cherry_log', 'Stripped Cherry Log', 'Stripped_Cherry_Log.png'),
(46, 'stripped_cherry_wood', 'Stripped Cherry Wood', 'Stripped_Cherry_Wood.png'),
(47, 'cherry_planks', 'Cherry Planks', 'Cherry_Planks.png'),
(48, 'cherry_slab', 'Cherry Slab', 'Cherry_Slab.png'),
(49, 'pale_oak_log', 'Pale Oak Log', 'Pale_Oak_Log.png'),
(50, 'pale_oak_wood', 'Pale Oak Wood', 'Pale_Oak_Wood.png'),
(51, 'stripped_pale_oak_log', 'Stripped Pale Oak Log', 'Stripped_Pale_Oak_Log.png'),
(52, 'stripped_pale_oak_wood', 'Stripped Pale Oak Wood', 'Stripped_Pale_Oak_Wood.png'),
(53, 'pale_oak_planks', 'Pale Oak Planks', 'Pale_Oak_Planks.png'),
(54, 'pale_oak_slab', 'Pale Oak Slab', 'Pale_Oak_Slab.png'),
(55, 'block_of_bamboo', 'Block of Bamboo', 'Block_of_Bamboo.png'),
(56, 'block_of_stripped_bamboo', 'Block of Stripped Bamboo', 'Block_of_Stripped_Bamboo.png'),
(57, 'bamboo_planks', 'Bamboo Planks', 'Bamboo_Planks.png'),
(58, 'bamboo_mosaic', 'Bamboo Mosaic', 'Bamboo_Mosaic.png'),
(59, 'bamboo_slab', 'Bamboo Slab', 'Bamboo_Slab.png'),
(60, 'crimson_stem', 'Crimson Stem', 'Crimson_Stem.png'),
(61, 'crimson_hyphae', 'Crimson Hyphae', 'Crimson_Hyphae.png'),
(62, 'stripped_crimson_stem', 'Stripped Crimson Stem', 'Stripped_Crimson_Stem.png'),
(63, 'stripped_crimson_hyphae', 'Stripped Crimson Hyphae', 'Stripped_Crimson_Hyphae.png'),
(64, 'crimson_planks', 'Crimson Planks', 'Crimson_Planks.png'),
(65, 'crimson_slab', 'Crimson Slab', 'Crimson_Slab.png'),
(66, 'warped_stem', 'Warped Stem', 'Warped_Stem.png'),
(67, 'warped_hyphae', 'Warped Hyphae', 'Warped_Hyphae.png'),
(68, 'stripped_warped_stem', 'Stripped Warped Stem', 'Stripped_Warped_Stem.png'),
(69, 'stripped_warped_hyphae', 'Stripped Warped Hyphae', 'Stripped_Warped_Hyphae.png'),
(70, 'warped_planks', 'Warped Planks', 'Warped_Planks.png'),
(71, 'warped_slab', 'Warped Slab', 'Warped_Slab.png'),
(72, 'stone', 'Stone', 'Stone.png'),
(73, 'stone_slab', 'Stone Slab', 'Stone_Slab.png'),
(74, 'stone_pressure_plate', 'Stone Pressure Plate', 'Stone_Pressure_Plate.png'),
(75, 'cobblestone', 'Cobblestone', 'Cobblestone.png'),
(76, 'mossy_cobblestone', 'Mossy Cobblestone', 'Mossy_Cobblestone.png'),
(77, 'smooth_stone', 'Smooth Stone', 'Smooth_Stone.png'),
(78, 'smooth_stone_slab', 'Smooth Stone Slab', 'Smooth_Stone_Slab.png'),
(79, 'stone_bricks', 'Stone Bricks', 'Stone_Bricks.png'),
(80, 'stone_brick_slab', 'Stone Brick Slab', 'Stone_Brick_Slab.png'),
(81, 'chiseled_stone_bricks', 'Chiseled Stone Bricks', 'Chiseled_Stone_Bricks.png'),
(82, 'mossy_stone_bricks', 'Mossy Stone Bricks', 'Mossy_Stone_Bricks.png'),
(83, 'granite', 'Granite', 'Granite.png'),
(84, 'polished_granite', 'Polished Granite', 'Polished_Granite.png'),
(85, 'diorite', 'Diorite', 'Diorite.png'),
(86, 'polished_diorite', 'Polished Diorite', 'Polished_Diorite.png'),
(87, 'andesite', 'Andesite', 'Andesite.png'),
(88, 'polished_andesite', 'Polished Andesite', 'Polished_Andesite.png'),
(89, 'cobbled_deepslate', 'Cobbled Deepslate', 'Cobbled_Deepslate.png'),
(90, 'cobbled_deepslate_slab', 'Cobbled Deepslate Slab', 'Cobbled_Deepslate_Slab.png'),
(91, 'polished_deepslate', 'Polished Deepslate', 'Polished_Deepslate.png'),
(92, 'deepslate_bricks', 'Deepslate Bricks', 'Deepslate_Bricks.png'),
(93, 'deepslate_tiles', 'Deepslate Tiles', 'Deepslate_Tiles.png'),
(94, 'tuff', 'Tuff', 'Tuff.png'),
(95, 'tuff_slab', 'Tuff Slab', 'Tuff_Slab.png'),
(96, 'polished_tuff', 'Polished Tuff', 'Polished_Tuff.png'),
(97, 'tuff_bricks', 'Tuff Bricks', 'Tuff_Bricks.png'),
(98, 'tuff_brick_slab', 'Tuff Brick Slab', 'Tuff_Brick_Slab.png'),
(99, 'bricks', 'Bricks', 'Bricks.png'),
(100, 'packed_mud', 'Packed Mud', 'Packed_Mud.png'),
(101, 'mud_bricks', 'Mud Bricks', 'Mud_Bricks.png'),
(102, 'sandstone', 'Sandstone', 'Sandstone.png'),
(103, 'sandstone_slab', 'Sandstone Slab', 'Sandstone_Slab.png'),
(104, 'chiseled_sandstone', 'Chiseled Sandstone', 'Chiseled_Sandstone.png'),
(105, 'smooth_sandstone', 'Smooth Sandstone', 'Smooth_Sandstone.png'),
(106, 'cut_sandstone', 'Cut Sandstone', 'Cut_Sandstone.png'),
(107, 'red_sandstone', 'Red Sandstone', 'Red_Sandstone.png'),
(108, 'red_sandstone_slab', 'Red Sandstone Slab', 'Red_Sandstone_Slab.png'),
(109, 'chiseled_red_sandstone', 'Chiseled Red Sandstone', 'Chiseled_Red_Sandstone.png'),
(110, 'smooth_red_sandstone', 'Smooth Red Sandstone', 'Smooth_Red_Sandstone.png'),
(111, 'cut_red_sandstone', 'Cut Red Sandstone', 'Cut_Red_Sandstone.png'),
(112, 'prismarine', 'Prismarine', 'Prismarine.png'),
(113, 'prismarine_bricks', 'Prismarine Bricks', 'Prismarine_Bricks.png'),
(114, 'dark_prismarine', 'Dark Prismarine', 'Dark_Prismarine.png'),
(115, 'netherrack', 'Netherrack', 'Netherrack.png'),
(116, 'nether_bricks', 'Nether Bricks', 'Nether_Bricks.png'),
(117, 'nether_brick_slab', 'Nether Brick Slab', 'Nether_Brick_Slab.png'),
(118, 'red_nether_bricks', 'Red Nether Bricks', 'Red_Nether_Bricks.png'),
(119, 'basalt', 'Basalt', 'Basalt.png'),
(120, 'blackstone', 'Blackstone', 'Blackstone.png'),
(121, 'polished_blackstone', 'Polished Blackstone', 'Polished_Blackstone.png'),
(122, 'polished_blackstone_slab', 'Polished Blackstone Slab', 'Polished_Blackstone_Slab.png'),
(123, 'polished_blackstone_bricks', 'Polished Blackstone Bricks', 'Polished_Blackstone_Bricks.png'),
(124, 'end_stone', 'End Stone', 'End_Stone.png'),
(125, 'end_stone_bricks', 'End Stone Bricks', 'End_Stone_Bricks.png'),
(126, 'purpur_block', 'Purpur Block', 'Purpur_Block.png'),
(127, 'purpur_pillar', 'Purpur Pillar', 'Purpur_Pillar.png'),
(128, 'purpur_slab', 'Purpur Slab', 'Purpur_Slab.png'),
(129, 'resin_bricks', 'Resin Bricks', 'Resin_Bricks.png'),
(130, 'resin_brick_slab', 'Resin Brick Slab', 'Resin_Brick_Slab.png'),
(131, 'block_of_coal', 'Block of Coal', 'Block_of_Coal.png'),
(132, 'block_of_iron', 'Block of Iron', 'Block_of_Iron.png'),
(133, 'chain', 'Chain', 'Chain.png'),
(134, 'block_of_gold', 'Block of Gold', 'Block_of_Gold.png'),
(135, 'block_of_redstone', 'Block of Redstone', 'Block_of_Redstone.png'),
(136, 'block_of_emerald', 'Block of Emerald', 'Block_of_Emerald.png'),
(137, 'block_of_lapis_lazuli', 'Block of Lapis Lazuli', 'Block_of_Lapis_Lazuli.png'),
(138, 'block_of_diamond', 'Block of Diamond', 'Block_of_Diamond.png'),
(139, 'block_of_netherite', 'Block of Netherite', 'Block_of_Netherite.png'),
(140, 'block_of_quartz', 'Block of Quartz', 'Block_of_Quartz.png'),
(141, 'quartz_slab', 'Quartz Slab', 'Quartz_Slab.png'),
(142, 'chiseled_quartz_block', 'Chiseled Quartz Block', 'Chiseled_Quartz_Block.png'),
(143, 'quartz_pillar', 'Quartz Pillar', 'Quartz_Pillar.png'),
(144, 'smooth_quartz_block', 'Smooth Quartz Block', 'Smooth_Quartz_Block.png'),
(145, 'block_of_copper', 'Block of Copper', 'Block_of_Copper.png'),
(146, 'chiseled_copper', 'Chiseled Copper', 'Chiseled_Copper.png'),
(147, 'copper_grate', 'Copper Grate', 'Copper_Grate.png'),
(148, 'cut_copper', 'Cut Copper', 'Cut_Copper.png'),
(149, 'cut_copper_stairs', 'Cut Copper Stairs', 'Cut_Copper_Stairs.png'),
(150, 'cut_copper_slab', 'Cut Copper Slab', 'Cut_Copper_Slab.png'),
(151, 'copper_door', 'Copper Door', 'Copper_Door.png'),
(152, 'copper_trapdoor', 'Copper Trapdoor', 'Copper_Trapdoor.png'),
(153, 'copper_bulb', 'Copper Bulb', 'Copper_Bulb.png'),
(154, 'exposed_copper', 'Exposed Copper', 'Exposed_Copper.png'),
(155, 'exposed_chiseled_copper', 'Exposed Chiseled Copper', 'Exposed_Chiseled_Copper.png'),
(156, 'exposed_copper_grate', 'Exposed Copper Grate', 'Exposed_Copper_Grate.png'),
(157, 'exposed_cut_copper', 'Exposed Cut Copper', 'Exposed_Cut_Copper.png'),
(158, 'exposed_cut_copper_stairs', 'Exposed Cut Copper Stairs', 'Exposed_Cut_Copper_Stairs.png'),
(159, 'exposed_cut_copper_slab', 'Exposed Cut Copper Slab', 'Exposed_Cut_Copper_Slab.png'),
(160, 'exposed_copper_door', 'Exposed Copper Door', 'Exposed_Copper_Door.png'),
(161, 'exposed_copper_trapdoor', 'Exposed Copper Trapdoor', 'Exposed_Copper_Trapdoor.png'),
(162, 'exposed_copper_bulb', 'Exposed Copper Bulb', 'Exposed_Copper_Bulb.png'),
(163, 'weathered_copper', 'Weathered Copper', 'Weathered_Copper.png'),
(164, 'weathered_chiseled_copper', 'Weathered Chiseled Copper', 'Weathered_Chiseled_Copper.png'),
(165, 'weathered_copper_grate', 'Weathered Copper Grate', 'Weathered_Copper_Grate.png'),
(166, 'weathered_cut_copper', 'Weathered Cut Copper', 'Weathered_Cut_Copper.png'),
(167, 'weathered_cut_copper_stairs', 'Weathered Cut Copper Stairs', 'Weathered_Cut_Copper_Stairs.png'),
(168, 'weathered_cut_copper_slab', 'Weathered Cut Copper Slab', 'Weathered_Cut_Copper_Slab.png'),
(169, 'weathered_copper_door', 'Weathered Copper Door', 'Weathered_Copper_Door.png'),
(170, 'weathered_copper_trapdoor', 'Weathered Copper Trapdoor', 'Weathered_Copper_Trapdoor.png'),
(171, 'weathered_copper_bulb', 'Weathered Copper Bulb', 'Weathered_Copper_Bulb.png'),
(172, 'oxidized_copper', 'Oxidized Copper', 'Oxidized_Copper.png'),
(173, 'oxidized_chiseled_copper', 'Oxidized Chiseled Copper', 'Oxidized_Chiseled_Copper.png'),
(174, 'oxidized_copper_grate', 'Oxidized Copper Grate', 'Oxidized_Copper_Grate.png'),
(175, 'oxidized_cut_copper', 'Oxidized Cut Copper', 'Oxidized_Cut_Copper.png'),
(176, 'oxidized_cut_copper_stairs', 'Oxidized Cut Copper Stairs', 'Oxidized_Cut_Copper_Stairs.png'),
(177, 'oxidized_cut_copper_slab', 'Oxidized Cut Copper Slab', 'Oxidized_Cut_Copper_Slab.png'),
(178, 'oxidized_copper_door', 'Oxidized Copper Door', 'Oxidized_Copper_Door.png'),
(179, 'oxidized_copper_trapdoor', 'Oxidized Copper Trapdoor', 'Oxidized_Copper_Trapdoor.png'),
(180, 'oxidized_copper_bulb', 'Oxidized Copper Bulb', 'Oxidized_Copper_Bulb.png'),
(181, 'waxed_block_of_copper', 'Waxed Block of Copper', 'Block_of_Copper.png'),
(182, 'waxed_cut_copper', 'Waxed Cut Copper', 'Cut_Copper.png'),
(183, 'waxed_cut_copper_slab', 'Waxed Cut Copper Slab', 'Cut_Copper_Slab.png'),
(184, 'waxed_exposed_copper', 'Waxed Exposed Copper', 'Exposed_Copper.png'),
(185, 'waxed_exposed_cut_copper', 'Waxed Exposed Cut Copper', 'Exposed_Cut_Copper.png'),
(186, 'waxed_exposed_cut_copper_slab', 'Waxed Exposed Cut Copper Slab', 'Exposed_Cut_Copper_Slab.png'),
(187, 'waxed_weathered_copper', 'Waxed Weathered Copper', 'Weathered_Copper.png'),
(188, 'waxed_weathered_cut_copper', 'Waxed Weathered Cut Copper', 'Weathered_Cut_Copper.png'),
(189, 'waxed_weathered_cut_copper_slab', 'Waxed Weathered Cut Copper Slab', 'Weathered_Cut_Copper_Slab.png'),
(190, 'waxed_oxidized_copper', 'Waxed Oxidized Copper', 'Oxidized_Copper.png'),
(191, 'waxed_oxidized_cut_copper', 'Waxed Oxidized Cut Copper', 'Oxidized_Cut_Copper.png'),
(192, 'waxed_oxidized_cut_copper_slab', 'Waxed Oxidized Cut Copper Slab', 'Oxidized_Cut_Copper_Slab.png'),
(193, 'white_wool', 'White Wool', 'White_Wool.png'),
(194, 'light_gray_wool', 'Light Gray Wool', 'Light_Gray_Wool.png'),
(195, 'gray_wool', 'Gray Wool', 'Gray_Wool.png'),
(196, 'black_wool', 'Black Wool', 'Black_Wool.png'),
(197, 'brown_wool', 'Brown Wool', 'Brown_Wool.png'),
(198, 'red_wool', 'Red Wool', 'Red_Wool.png'),
(199, 'orange_wool', 'Orange Wool', 'Orange_Wool.png'),
(200, 'yellow_wool', 'Yellow Wool', 'Yellow_Wool.png'),
(201, 'lime_wool', 'Lime Wool', 'Lime_Wool.png'),
(202, 'green_wool', 'Green Wool', 'Green_Wool.png'),
(203, 'cyan_wool', 'Cyan Wool', 'Cyan_Wool.png'),
(204, 'light_blue_wool', 'Light Blue Wool', 'Light_Blue_Wool.png'),
(205, 'blue_wool', 'Blue Wool', 'Blue_Wool.png'),
(206, 'purple_wool', 'Purple Wool', 'Purple_Wool.png'),
(207, 'magenta_wool', 'Magenta Wool', 'Magenta_Wool.png'),
(208, 'pink_wool', 'Pink Wool', 'Pink_Wool.png'),
(209, 'white_carpet', 'White Carpet', 'White_Carpet.png'),
(210, 'light_gray_carpet', 'Light Gray Carpet', 'Light_Gray_Carpet.png'),
(211, 'gray_carpet', 'Gray Carpet', 'Gray_Carpet.png'),
(212, 'black_carpet', 'Black Carpet', 'Black_Carpet.png'),
(213, 'brown_carpet', 'Brown Carpet', 'Brown_Carpet.png'),
(214, 'red_carpet', 'Red Carpet', 'Red_Carpet.png'),
(215, 'orange_carpet', 'Orange Carpet', 'Orange_Carpet.png'),
(216, 'yellow_carpet', 'Yellow Carpet', 'Yellow_Carpet.png'),
(217, 'lime_carpet', 'Lime Carpet', 'Lime_Carpet.png'),
(218, 'green_carpet', 'Green Carpet', 'Green_Carpet.png'),
(219, 'cyan_carpet', 'Cyan Carpet', 'Cyan_Carpet.png'),
(220, 'light_blue_carpet', 'Light Blue Carpet', 'Light_Blue_Carpet.png'),
(221, 'blue_carpet', 'Blue Carpet', 'Blue_Carpet.png'),
(222, 'purple_carpet', 'Purple Carpet', 'Purple_Carpet.png'),
(223, 'magenta_carpet', 'Magenta Carpet', 'Magenta_Carpet.png'),
(224, 'pink_carpet', 'Pink Carpet', 'Pink_Carpet.png'),
(225, 'terracotta', 'Terracotta', 'Terracotta.png'),
(226, 'glass', 'Glass', 'Glass.png'),
(227, 'white_stained_glass', 'White Stained Glass', 'White_Stained_Glass.png'),
(228, 'light_gray_stained_glass', 'Light Gray Stained Glass', 'Light_Gray_Stained_Glass.png'),
(229, 'gray_stained_glass', 'Gray Stained Glass', 'Gray_Stained_Glass.png'),
(230, 'black_stained_glass', 'Black Stained Glass', 'Black_Stained_Glass.png'),
(231, 'brown_stained_glass', 'Brown Stained Glass', 'Brown_Stained_Glass.png'),
(232, 'red_stained_glass', 'Red Stained Glass', 'Red_Stained_Glass.png'),
(233, 'orange_stained_glass', 'Orange Stained Glass', 'Orange_Stained_Glass.png'),
(234, 'yellow_stained_glass', 'Yellow Stained Glass', 'Yellow_Stained_Glass.png'),
(235, 'lime_stained_glass', 'Lime Stained Glass', 'Lime_Stained_Glass.png'),
(236, 'green_stained_glass', 'Green Stained Glass', 'Green_Stained_Glass.png'),
(237, 'cyan_stained_glass', 'Cyan Stained Glass', 'Cyan_Stained_Glass.png'),
(238, 'light_blue_stained_glass', 'Light Blue Stained Glass', 'Light_Blue_Stained_Glass.png'),
(239, 'blue_stained_glass', 'Blue Stained Glass', 'Blue_Stained_Glass.png'),
(240, 'purple_stained_glass', 'Purple Stained Glass', 'Purple_Stained_Glass.png'),
(241, 'magenta_stained_glass', 'Magenta Stained Glass', 'Magenta_Stained_Glass.png'),
(242, 'pink_stained_glass', 'Pink Stained Glass', 'Pink_Stained_Glass.png'),
(243, 'glass_pane', 'Glass Pane', 'Glass_Pane.png'),
(244, 'shulker_box', 'Shulker Box', 'Shulker_Box.png'),
(245, 'white_shulker_box', 'White Shulker Box', 'White_Shulker_Box.png'),
(246, 'light_gray_shulker_box', 'Light Gray Shulker Box', 'Light_Gray_Shulker_Box.png'),
(247, 'gray_shulker_box', 'Gray Shulker Box', 'Gray_Shulker_Box.png'),
(248, 'black_shulker_box', 'Black Shulker Box', 'Black_Shulker_Box.png'),
(249, 'brown_shulker_box', 'Brown Shulker Box', 'Brown_Shulker_Box.png'),
(250, 'red_shulker_box', 'Red Shulker Box', 'Red_Shulker_Box.png'),
(251, 'orange_shulker_box', 'Orange Shulker Box', 'Orange_Shulker_Box.png'),
(252, 'yellow_shulker_box', 'Yellow Shulker Box', 'Yellow_Shulker_Box.png'),
(253, 'lime_shulker_box', 'Lime Shulker Box', 'Lime_Shulker_Box.png'),
(254, 'green_shulker_box', 'Green Shulker Box', 'Green_Shulker_Box.png'),
(255, 'cyan_shulker_box', 'Cyan Shulker Box', 'Cyan_Shulker_Box.png'),
(256, 'light_blue_shulker_box', 'Light Blue Shulker Box', 'Light_Blue_Shulker_Box.png'),
(257, 'blue_shulker_box', 'Blue Shulker Box', 'Blue_Shulker_Box.png'),
(258, 'purple_shulker_box', 'Purple Shulker Box', 'Purple_Shulker_Box.png'),
(259, 'magenta_shulker_box', 'Magenta Shulker Box', 'Magenta_Shulker_Box.png'),
(260, 'pink_shulker_box', 'Pink Shulker Box', 'Pink_Shulker_Box.png'),
(261, 'white_bed', 'White Bed', 'White_Bed.png'),
(262, 'light_gray_bed', 'Light Gray Bed', 'Light_Gray_Bed.png'),
(263, 'gray_bed', 'Gray Bed', 'Gray_Bed.png'),
(264, 'black_bed', 'Black Bed', 'Black_Bed.png'),
(265, 'brown_bed', 'Brown Bed', 'Brown_Bed.png'),
(266, 'red_bed', 'Red Bed', 'Red_Bed.png'),
(267, 'orange_bed', 'Orange Bed', 'Orange_Bed.png'),
(268, 'yellow_bed', 'Yellow Bed', 'Yellow_Bed.png'),
(269, 'lime_bed', 'Lime Bed', 'Lime_Bed.png'),
(270, 'green_bed', 'Green Bed', 'Green_Bed.png'),
(271, 'cyan_bed', 'Cyan Bed', 'Cyan_Bed.png'),
(272, 'light_blue_bed', 'Light Blue Bed', 'Light_Blue_Bed.png'),
(273, 'blue_bed', 'Blue Bed', 'Blue_Bed.png'),
(274, 'purple_bed', 'Purple Bed', 'Purple_Bed.png'),
(275, 'magenta_bed', 'Magenta Bed', 'Magenta_Bed.png'),
(276, 'pink_bed', 'Pink Bed', 'Pink_Bed.png'),
(277, 'candle', 'Candle', 'Candle.png'),
(278, 'white_banner', 'White Banner', 'White_Banner.png'),
(279, 'light_gray_banner', 'Light Gray Banner', 'Light_Gray_Banner.png'),
(280, 'gray_banner', 'Gray Banner', 'Gray_Banner.png'),
(281, 'black_banner', 'Black Banner', 'Black_Banner.png'),
(282, 'brown_banner', 'Brown Banner', 'Brown_Banner.png'),
(283, 'red_banner', 'Red Banner', 'Red_Banner.png'),
(284, 'orange_banner', 'Orange Banner', 'Orange_Banner.png'),
(285, 'yellow_banner', 'Yellow Banner', 'Yellow_Banner.png'),
(286, 'lime_banner', 'Lime Banner', 'Lime_Banner.png'),
(287, 'green_banner', 'Green Banner', 'Green_Banner.png'),
(288, 'cyan_banner', 'Cyan Banner', 'Cyan_Banner.png'),
(289, 'light_blue_banner', 'Light Blue Banner', 'Light_Blue_Banner.png'),
(290, 'blue_banner', 'Blue Banner', 'Blue_Banner.png'),
(291, 'purple_banner', 'Purple Banner', 'Purple_Banner.png'),
(292, 'magenta_banner', 'Magenta Banner', 'Magenta_Banner.png'),
(293, 'pink_banner', 'Pink Banner', 'Pink_Banner.png'),
(294, 'ominous_banner', 'Ominous Banner', 'Ominous_Banner.png'),
(295, 'dirt', 'Dirt', 'Dirt.png'),
(296, 'mud', 'Mud', 'Mud.png'),
(297, 'gravel', 'Gravel', 'Gravel.png'),
(298, 'sand', 'Sand', 'Sand.png'),
(299, 'red_sand', 'Red Sand', 'Red_Sand.png'),
(300, 'ice', 'Ice', 'Ice.png'),
(301, 'packed_ice', 'Packed Ice', 'Packed_Ice.png'),
(302, 'snow_block', 'Snow Block', 'Snow_Block.png'),
(303, 'moss_block', 'Moss Block', 'Moss_Block.png'),
(304, 'pale_moss_block', 'Pale Moss Block', 'Pale_Moss_Block.png'),
(305, 'pointed_dripstone', 'Pointed Dripstone', 'Pointed_Dripstone.png'),
(306, 'obsidian', 'Obsidian', 'Obsidian.png'),
(307, 'crying_obsidian', 'Crying Obsidian', 'Crying_Obsidian.png'),
(308, 'soul_sand', 'Soul Sand', 'Soul_Sand.png'),
(309, 'soul_soil', 'Soul Soil', 'Soul_Soil.png'),
(310, 'bone_block', 'Bone Block', 'Bone_Block.png'),
(311, 'block_of_raw_iron', 'Block of Raw Iron', 'Block_of_Raw_Iron.png'),
(312, 'block_of_raw_copper', 'Block of Raw Copper', 'Block_of_Raw_Copper.png'),
(313, 'block_of_raw_gold', 'Block of Raw Gold', 'Block_of_Raw_Gold.png'),
(314, 'glowstone', 'Glowstone', 'Glowstone.png'),
(315, 'block_of_resin', 'Block of Resin', 'Block_of_Resin.png'),
(316, 'mangrove_roots', 'Mangrove Roots', 'Mangrove_Roots.png'),
(317, 'brown_mushroom', 'Brown Mushroom', 'Brown_Mushroom.png'),
(318, 'red_mushroom', 'Red Mushroom', 'Red_Mushroom.png'),
(319, 'warped_fungus', 'Warped Fungus', 'Warped_Fungus.png'),
(320, 'dandelion', 'Dandelion', 'Dandelion.png'),
(321, 'poppy', 'Poppy', 'Poppy.png'),
(322, 'blue_orchid', 'Blue Orchid', 'Blue_Orchid.png'),
(323, 'allium', 'Allium', 'Allium.png'),
(324, 'azure_bluet', 'Azure Bluet', 'Azure_Bluet.png'),
(325, 'red_tulip', 'Red Tulip', 'Red_Tulip.png'),
(326, 'orange_tulip', 'Orange Tulip', 'Orange_Tulip.png'),
(327, 'white_tulip', 'White Tulip', 'White_Tulip.png'),
(328, 'pink_tulip', 'Pink Tulip', 'Pink_Tulip.png'),
(329, 'oxeye_daisy', 'Oxeye Daisy', 'Oxeye_Daisy.png'),
(330, 'cornflower', 'Cornflower', 'Cornflower.png'),
(331, 'lily_of_the_valley', 'Lily of the Valley', 'Lily_of_the_Valley.png'),
(332, 'torchflower', 'Torchflower', 'Torchflower.png'),
(333, 'wither_rose', 'Wither Rose', 'Wither_Rose.png'),
(334, 'closed_eyeblossom', 'Closed Eyeblossom', 'Closed_Eyeblossom.png'),
(335, 'open_eyeblossom', 'Open Eyeblossom', 'Open_Eyeblossom.png'),
(336, 'pink_petals', 'Pink Petals', 'Pink_Petals.png'),
(337, 'bamboo', 'Bamboo', 'Bamboo.png'),
(338, 'sugar_cane', 'Sugar Cane', 'Sugar_Cane.png'),
(339, 'vines', 'Vines', 'Vines.png'),
(340, 'sunflower', 'Sunflower', 'Sunflower.png'),
(341, 'lilac', 'Lilac', 'Lilac.png'),
(342, 'rose_bush', 'Rose Bush', 'Rose_Bush.png'),
(343, 'peony', 'Peony', 'Peony.png'),
(344, 'pitcher_plant', 'Pitcher Plant', 'Pitcher_Plant.png'),
(345, 'cocoa_beans', 'Cocoa Beans', 'Cocoa_Beans.png'),
(346, 'nether_wart', 'Nether Wart', 'Nether_Wart.png'),
(347, 'dried_kelp_block', 'Dried Kelp Block', 'Dried_Kelp_Block.png'),
(348, 'pumpkin', 'Pumpkin', 'Pumpkin.png'),
(349, 'carved_pumpkin', 'Carved Pumpkin', 'Carved_Pumpkin.png'),
(350, 'hay_bale', 'Hay Bale', 'Hay_Bale.png'),
(351, 'slime_block', 'Slime Block', 'Slime_Block.png'),
(352, 'honey_block', 'Honey Block', 'Honey_Block.png'),
(353, 'sculk_sensor', 'Sculk Sensor', 'Sculk_Sensor.png'),
(354, 'torch', 'Torch', 'Torch.png'),
(355, 'soul_torch', 'Soul Torch', 'Soul_Torch.png'),
(356, 'redstone_torch', 'Redstone Torch', 'Redstone_Torch.png'),
(357, 'crafting_table', 'Crafting Table', 'Crafting_Table.png'),
(358, 'furnace', 'Furnace', 'Furnace.png'),
(359, 'item_frame', 'Item Frame', 'Item_Frame.png'),
(360, 'bookshelf', 'Bookshelf', 'Bookshelf.png'),
(361, 'chest', 'Chest', 'Chest.png'),
(362, 'skeleton_skull', 'Skeleton Skull', 'Skeleton_Skull.png'),
(363, 'wither_skeleton_skull', 'Wither Skeleton Skull', 'Wither_Skeleton_Skull.png'),
(364, 'player_head', 'Player Head', 'Player_Head.png'),
(365, 'zombie_head', 'Zombie Head', 'Zombie_Head.png'),
(366, 'creeper_head', 'Creeper Head', 'Creeper_Head.png'),
(367, 'piglin_head', 'Piglin Head', 'Piglin_Head.png'),
(368, 'dragon_head', 'Dragon Head', 'Dragon_Head.png'),
(369, 'eye_of_ender', 'Eye of Ender', 'Eye_of_Ender.png'),
(370, 'redstone_dust', 'Redstone Dust', 'Redstone_Dust.png'),
(371, 'tripwire_hook', 'Tripwire Hook', 'Tripwire_Hook.png'),
(372, 'string', 'String', 'String.png'),
(373, 'piston', 'Piston', 'Piston.png'),
(374, 'dropper', 'Dropper', 'Dropper.png'),
(375, 'hopper', 'Hopper', 'Hopper.png'),
(376, 'trapped_chest', 'Trapped Chest', 'Trapped_Chest.png'),
(377, 'minecart', 'Minecart', 'Minecart.png'),
(378, 'tnt', 'TNT', 'TNT.png'),
(379, 'wooden_shovel', 'Wooden Shovel', 'Wooden_Shovel.png'),
(380, 'wooden_pickaxe', 'Wooden Pickaxe', 'Wooden_Pickaxe.png'),
(381, 'wooden_axe', 'Wooden Axe', 'Wooden_Axe.png'),
(382, 'wooden_hoe', 'Wooden Hoe', 'Wooden_Hoe.png'),
(383, 'stone_shovel', 'Stone Shovel', 'Stone_Shovel.png'),
(384, 'stone_pickaxe', 'Stone Pickaxe', 'Stone_Pickaxe.png'),
(385, 'stone_axe', 'Stone Axe', 'Stone_Axe.png'),
(386, 'stone_hoe', 'Stone Hoe', 'Stone_Hoe.png'),
(387, 'iron_shovel', 'Iron Shovel', 'Iron_Shovel.png'),
(388, 'iron_pickaxe', 'Iron Pickaxe', 'Iron_Pickaxe.png'),
(389, 'iron_axe', 'Iron Axe', 'Iron_Axe.png'),
(390, 'iron_hoe', 'Iron Hoe', 'Iron_Hoe.png'),
(391, 'golden_shovel', 'Golden Shovel', 'Golden_Shovel.png'),
(392, 'golden_pickaxe', 'Golden Pickaxe', 'Golden_Pickaxe.png'),
(393, 'golden_axe', 'Golden Axe', 'Golden_Axe.png'),
(394, 'golden_hoe', 'Golden Hoe', 'Golden_Hoe.png'),
(395, 'diamond_shovel', 'Diamond Shovel', 'Diamond_Shovel.png'),
(396, 'diamond_pickaxe', 'Diamond Pickaxe', 'Diamond_Pickaxe.png'),
(397, 'diamond_axe', 'Diamond Axe', 'Diamond_Axe.png'),
(398, 'diamond_hoe', 'Diamond Hoe', 'Diamond_Hoe.png'),
(399, 'netherite_shovel', 'Netherite Shovel', 'Netherite_Shovel.png'),
(400, 'netherite_pickaxe', 'Netherite Pickaxe', 'Netherite_Pickaxe.png'),
(401, 'netherite_axe', 'Netherite Axe', 'Netherite_Axe.png'),
(402, 'netherite_hoe', 'Netherite Hoe', 'Netherite_Hoe.png'),
(403, 'milk_bucket', 'Milk Bucket', 'Milk_Bucket.png'),
(404, 'fishing_rod', 'Fishing Rod', 'Fishing_Rod.png'),
(405, 'flint_and_steel', 'Flint and Steel', 'Flint_and_Steel.png'),
(406, 'fire_charge', 'Fire Charge', 'Fire_Charge.png'),
(407, 'bone_meal', 'Bone Meal', 'Bone_Meal.png'),
(408, 'shears', 'Shears', 'Shears.png'),
(409, 'brush', 'Brush', 'Brush.png'),
(410, 'bundle', 'Bundle', 'Bundle.png'),
(411, 'white_bundle', 'White Bundle', 'White_Bundle.png'),
(412, 'light_gray_bundle', 'Light Gray Bundle', 'Light_Gray_Bundle.png'),
(413, 'gray_bundle', 'Gray Bundle', 'Gray_Bundle.png'),
(414, 'black_bundle', 'Black Bundle', 'Black_Bundle.png'),
(415, 'brown_bundle', 'Brown Bundle', 'Brown_Bundle.png'),
(416, 'red_bundle', 'Red Bundle', 'Red_Bundle.png'),
(417, 'orange_bundle', 'Orange Bundle', 'Orange_Bundle.png'),
(418, 'yellow_bundle', 'Yellow Bundle', 'Yellow_Bundle.png'),
(419, 'lime_bundle', 'Lime Bundle', 'Lime_Bundle.png'),
(420, 'green_bundle', 'Green Bundle', 'Green_Bundle.png'),
(421, 'cyan_bundle', 'Cyan Bundle', 'Cyan_Bundle.png'),
(422, 'light_blue_bundle', 'Light Blue Bundle', 'Light_Blue_Bundle.png'),
(423, 'blue_bundle', 'Blue Bundle', 'Blue_Bundle.png'),
(424, 'purple_bundle', 'Purple Bundle', 'Purple_Bundle.png'),
(425, 'magenta_bundle', 'Magenta Bundle', 'Magenta_Bundle.png'),
(426, 'pink_bundle', 'Pink Bundle', 'Pink_Bundle.png'),
(427, 'compass', 'Compass', 'Compass.png'),
(428, 'ender_pearl', 'Ender Pearl', 'Ender_Pearl.png'),
(429, 'elytra', 'Elytra', 'Elytra.png'),
(430, 'carrot_on_a_stick', 'Carrot on a Stick', 'Carrot_on_a_Stick.png'),
(431, 'warped_fungus_on_a_stick', 'Warped Fungus on a Stick', 'Warped_Fungus_on_a_Stick.png'),
(432, 'oak_boat', 'Oak Boat', 'Oak_Boat.png'),
(433, 'spruce_boat', 'Spruce Boat', 'Spruce_Boat.png'),
(434, 'birch_boat', 'Birch Boat', 'Birch_Boat.png'),
(435, 'jungle_boat', 'Jungle Boat', 'Jungle_Boat.png'),
(436, 'acacia_boat', 'Acacia Boat', 'Acacia_Boat.png'),
(437, 'dark_oak_boat', 'Dark Oak Boat', 'Dark_Oak_Boat.png'),
(438, 'mangrove_boat', 'Mangrove Boat', 'Mangrove_Boat.png'),
(439, 'cherry_boat', 'Cherry Boat', 'Cherry_Boat.png'),
(440, 'pale_oak_boat', 'Pale Oak Boat', 'Pale_Oak_Boat.png'),
(441, 'bamboo_raft', 'Bamboo Raft', 'Bamboo_Raft.png'),
(442, 'wooden_sword', 'Wooden Sword', 'Wooden_Sword.png'),
(443, 'stone_sword', 'Stone Sword', 'Stone_Sword.png'),
(444, 'iron_sword', 'Iron Sword', 'Iron_Sword.png'),
(445, 'golden_sword', 'Golden Sword', 'Golden_Sword.png'),
(446, 'diamond_sword', 'Diamond Sword', 'Diamond_Sword.png'),
(447, 'netherite_sword', 'Netherite Sword', 'Netherite_Sword.png'),
(448, 'trident', 'Trident', 'Trident.png'),
(449, 'mace', 'Mace', 'Mace.png'),
(450, 'shield', 'Shield', 'Shield.png'),
(451, 'leather_cap', 'Leather Cap', 'Leather_Cap.png'),
(452, 'leather_tunic', 'Leather Tunic', 'Leather_Tunic.png'),
(453, 'leather_pants', 'Leather Pants', 'Leather_Pants.png'),
(454, 'leather_boots', 'Leather Boots', 'Leather_Boots.png'),
(455, 'chainmail_helmet', 'Chainmail Helmet', 'Chainmail_Helmet.png'),
(456, 'chainmail_chestplate', 'Chainmail Chestplate', 'Chainmail_Chestplate.png'),
(457, 'chainmail_leggings', 'Chainmail Leggings', 'Chainmail_Leggings.png'),
(458, 'chainmail_boots', 'Chainmail Boots', 'Chainmail_Boots.png'),
(459, 'iron_helmet', 'Iron Helmet', 'Iron_Helmet.png'),
(460, 'iron_chestplate', 'Iron Chestplate', 'Iron_Chestplate.png'),
(461, 'iron_leggings', 'Iron Leggings', 'Iron_Leggings.png'),
(462, 'iron_boots', 'Iron Boots', 'Iron_Boots.png'),
(463, 'golden_helmet', 'Golden Helmet', 'Golden_Helmet.png'),
(464, 'golden_chestplate', 'Golden Chestplate', 'Golden_Chestplate.png'),
(465, 'golden_leggings', 'Golden Leggings', 'Golden_Leggings.png'),
(466, 'golden_boots', 'Golden Boots', 'Golden_Boots.png'),
(467, 'diamond_helmet', 'Diamond Helmet', 'Diamond_Helmet.png'),
(468, 'diamond_chestplate', 'Diamond Chestplate', 'Diamond_Chestplate.png'),
(469, 'diamond_leggings', 'Diamond Leggings', 'Diamond_Leggings.png'),
(470, 'diamond_boots', 'Diamond Boots', 'Diamond_Boots.png'),
(471, 'netherite_helmet', 'Netherite Helmet', 'Netherite_Helmet.png'),
(472, 'netherite_chestplate', 'Netherite Chestplate', 'Netherite_Chestplate.png'),
(473, 'netherite_leggings', 'Netherite Leggings', 'Netherite_Leggings.png'),
(474, 'netherite_boots', 'Netherite Boots', 'Netherite_Boots.png'),
(475, 'turtle_shell', 'Turtle Shell', 'Turtle_Shell.png'),
(476, 'leather_horse_armor', 'Leather Horse Armor', 'Leather_Horse_Armor.png'),
(477, 'iron_horse_armor', 'Iron Horse Armor', 'Iron_Horse_Armor.png'),
(478, 'golden_horse_armor', 'Golden Horse Armor', 'Golden_Horse_Armor.png'),
(479, 'diamond_horse_armor', 'Diamond Horse Armor', 'Diamond_Horse_Armor.png'),
(480, 'wolf_armor', 'Wolf Armor', 'Wolf_Armor.png'),
(481, 'snowball', 'Snowball', 'Snowball.png'),
(482, 'egg', 'Egg', 'Egg.png'),
(483, 'bow', 'Bow', 'Bow.png'),
(484, 'crossbow', 'Crossbow', 'Crossbow.png'),
(485, 'arrow', 'Arrow', 'Arrow.png'),
(486, 'apple', 'Apple', 'Apple.png'),
(487, 'enchanted_golden_apple', 'Enchanted Golden Apple', 'Enchanted_Golden_Apple.png'),
(488, 'melon_slice', 'Melon Slice', 'Melon_Slice.png'),
(489, 'carrot', 'Carrot', 'Carrot.png'),
(490, 'baked_potato', 'Baked Potato', 'Baked_Potato.png'),
(491, 'beetroot', 'Beetroot', 'Beetroot.png'),
(492, 'dried_kelp', 'Dried Kelp', 'Dried_Kelp.png'),
(493, 'cooked_rabbit', 'Cooked Rabbit', 'Cooked_Rabbit.png'),
(494, 'spider_eye', 'Spider Eye', 'Spider_Eye.png'),
(495, 'honey_bottle', 'Honey Bottle', 'Honey_Bottle.png'),
(496, 'lingering_water_bottle', 'Lingering Water Bottle', 'Lingering_Water_Bottle.png'),
(497, 'mundane_lingering_potion', 'Mundane Lingering Potion', 'Lingering_Water_Bottle.png'),
(498, 'thick_lingering_potion', 'Thick Lingering Potion', 'Lingering_Water_Bottle.png'),
(499, 'awkward_lingering_potion', 'Awkward Lingering Potion', 'Lingering_Water_Bottle.png'),
(500, 'lingering_potion_of_night_vision', 'Lingering Potion of Night Vision', 'Lingering_Potion_of_Night_Vision.png'),
(501, 'lingering_potion_of_invisibility', 'Lingering Potion of Invisibility', 'Lingering_Potion_of_Invisibility.png'),
(502, 'lingering_potion_of_leaping', 'Lingering Potion of Leaping', 'Lingering_Potion_of_Leaping.png'),
(503, 'lingering_potion_of_fire_resistance', 'Lingering Potion of Fire Resistance', 'Lingering_Potion_of_Fire_Resistance.png'),
(504, 'lingering_potion_of_swiftness', 'Lingering Potion of Swiftness', 'Lingering_Potion_of_Swiftness.png'),
(505, 'lingering_potion_of_slowness', 'Lingering Potion of Slowness', 'Lingering_Potion_of_Slowness.png'),
(506, 'lingering_potion_of_the_turtle_master', 'Lingering Potion of the Turtle Master', 'Lingering_Potion_of_the_Turtle_Master.png'),
(507, 'lingering_potion_of_water_breathing', 'Lingering Potion of Water Breathing', 'Lingering_Potion_of_Water_Breathing.png'),
(508, 'lingering_potion_of_healing', 'Lingering Potion of Healing', 'Lingering_Potion_of_Healing.png'),
(509, 'lingering_potion_of_harming', 'Lingering Potion of Harming', 'Lingering_Potion_of_Harming.png'),
(510, 'lingering_potion_of_poison', 'Lingering Potion of Poison', 'Lingering_Potion_of_Poison.png'),
(511, 'lingering_potion_of_regeneration', 'Lingering Potion of Regeneration', 'Lingering_Potion_of_Regeneration.png'),
(512, 'lingering_potion_of_strength', 'Lingering Potion of Strength', 'Lingering_Potion_of_Strength.png'),
(513, 'lingering_potion_of_weakness', 'Lingering Potion of Weakness', 'Lingering_Potion_of_Weakness.png'),
(514, 'lingering_potion_of_luck', 'Lingering Potion of Luck', 'Lingering_Potion_of_Luck.png'),
(515, 'lingering_potion_of_slow_falling', 'Lingering Potion of Slow Falling', 'Lingering_Potion_of_Slow_Falling.png'),
(516, 'lingering_potion_of_wind_charging', 'Lingering Potion of Wind Charging', 'Lingering_Potion_of_Wind_Charging.png'),
(517, 'lingering_potion_of_weaving', 'Lingering Potion of Weaving', 'Lingering_Potion_of_Weaving.png'),
(518, 'lingering_potion_of_oozing', 'Lingering Potion of Oozing', 'Lingering_Potion_of_Oozing.png'),
(519, 'lingering_potion_of_infestation', 'Lingering Potion of Infestation', 'Lingering_Potion_of_Infestation.png'),
(520, 'coal', 'Coal', 'Coal.png'),
(521, 'charcoal', 'Charcoal', 'Charcoal.png'),
(522, 'raw_iron', 'Raw Iron', 'Raw_Iron.png'),
(523, 'raw_copper', 'Raw Copper', 'Raw_Copper.png'),
(524, 'raw_gold', 'Raw Gold', 'Raw_Gold.png'),
(525, 'resin_clump', 'Resin Clump', 'Resin_Clump.png'),
(526, 'emerald', 'Emerald', 'Emerald.png'),
(527, 'lapis_lazuli', 'Lapis Lazuli', 'Lapis_Lazuli.png'),
(528, 'diamond', 'Diamond', 'Diamond.png'),
(529, 'nether_quartz', 'Nether Quartz', 'Nether_Quartz.png'),
(530, 'amethyst_shard', 'Amethyst Shard', 'Amethyst_Shard.png'),
(531, 'iron_nugget', 'Iron Nugget', 'Iron_Nugget.png'),
(532, 'gold_nugget', 'Gold Nugget', 'Gold_Nugget.png'),
(533, 'iron_ingot', 'Iron Ingot', 'Iron_Ingot.png'),
(534, 'copper_ingot', 'Copper Ingot', 'Copper_Ingot.png'),
(535, 'gold_ingot', 'Gold Ingot', 'Gold_Ingot.png'),
(536, 'netherite_scrap', 'Netherite Scrap', 'Netherite_Scrap.png'),
(537, 'netherite_ingot', 'Netherite Ingot', 'Netherite_Ingot.png'),
(538, 'stick', 'Stick', 'Stick.png'),
(539, 'flint', 'Flint', 'Flint.png'),
(540, 'wheat', 'Wheat', 'Wheat.png'),
(541, 'bone', 'Bone', 'Bone.png'),
(542, 'feather', 'Feather', 'Feather.png'),
(543, 'leather', 'Leather', 'Leather.png'),
(544, 'rabbit_hide', 'Rabbit Hide', 'Rabbit_Hide.png'),
(545, 'honeycomb', 'Honeycomb', 'Honeycomb.png'),
(546, 'ink_sac', 'Ink Sac', 'Ink_Sac.png'),
(547, 'glow_ink_sac', 'Glow Ink Sac', 'Glow_Ink_Sac.png'),
(548, 'turtle_scute', 'Turtle Scute', 'Turtle_Scute.png'),
(549, 'armadillo_scute', 'Armadillo Scute', 'Armadillo_Scute.png'),
(550, 'slimeball', 'Slimeball', 'Slimeball.png'),
(551, 'clay_ball', 'Clay Ball', 'Clay_Ball.png'),
(552, 'prismarine_shard', 'Prismarine Shard', 'Prismarine_Shard.png'),
(553, 'prismarine_crystals', 'Prismarine Crystals', 'Prismarine_Crystals.png'),
(554, 'nautilus_shell', 'Nautilus Shell', 'Nautilus_Shell.png'),
(555, 'heart_of_the_sea', 'Heart of the Sea', 'Heart_of_the_Sea.png'),
(556, 'blaze_rod', 'Blaze Rod', 'Blaze_Rod.png'),
(557, 'breeze_rod', 'Breeze Rod', 'Breeze_Rod.png'),
(558, 'heavy_core', 'Heavy Core', 'Heavy_Core.png'),
(559, 'nether_star', 'Nether Star', 'Nether_Star.png'),
(560, 'shulker_shell', 'Shulker Shell', 'Shulker_Shell.png'),
(561, 'popped_chorus_fruit', 'Popped Chorus Fruit', 'Popped_Chorus_Fruit.png'),
(562, 'echo_shard', 'Echo Shard', 'Echo_Shard.png'),
(563, 'disc_fragment', 'Disc Fragment', 'Disc_Fragment.png'),
(564, 'white_dye', 'White Dye', 'White_Dye.png'),
(565, 'light_gray_dye', 'Light Gray Dye', 'Light_Gray_Dye.png'),
(566, 'gray_dye', 'Gray Dye', 'Gray_Dye.png'),
(567, 'black_dye', 'Black Dye', 'Black_Dye.png'),
(568, 'brown_dye', 'Brown Dye', 'Brown_Dye.png'),
(569, 'red_dye', 'Red Dye', 'Red_Dye.png'),
(570, 'orange_dye', 'Orange Dye', 'Orange_Dye.png'),
(571, 'yellow_dye', 'Yellow Dye', 'Yellow_Dye.png'),
(572, 'lime_dye', 'Lime Dye', 'Lime_Dye.png'),
(573, 'green_dye', 'Green Dye', 'Green_Dye.png'),
(574, 'cyan_dye', 'Cyan Dye', 'Cyan_Dye.png'),
(575, 'light_blue_dye', 'Light Blue Dye', 'Light_Blue_Dye.png'),
(576, 'blue_dye', 'Blue Dye', 'Blue_Dye.png'),
(577, 'purple_dye', 'Purple Dye', 'Purple_Dye.png'),
(578, 'magenta_dye', 'Magenta Dye', 'Magenta_Dye.png'),
(579, 'pink_dye', 'Pink Dye', 'Pink_Dye.png'),
(580, 'bowl', 'Bowl', 'Bowl.png'),
(581, 'brick', 'Brick', 'Brick.png'),
(582, 'nether_brick', 'Nether Brick', 'Nether_Brick.png'),
(583, 'resin_brick', 'Resin Brick', 'Resin_Brick.png'),
(584, 'paper', 'Paper', 'Paper.png'),
(585, 'book', 'Book', 'Book.png'),
(586, 'firework_star', 'Firework Star', 'Firework_Star.png'),
(587, 'glass_bottle', 'Glass Bottle', 'Glass_Bottle.png'),
(588, 'glowstone_dust', 'Glowstone Dust', 'Glowstone_Dust.png'),
(589, 'gunpowder', 'Gunpowder', 'Gunpowder.png'),
(590, 'blaze_powder', 'Blaze Powder', 'Blaze_Powder.png'),
(591, 'sugar', 'Sugar', 'Sugar.png'),
(592, 'magma_cream', 'Magma Cream', 'Magma_Cream.png'),
(593, 'ghast_tear', 'Ghast Tear', 'Ghast_Tear.png'),
(594, 'netherite_upgrade', 'Smithing Template', 'Netherite_Upgrade.png'),
(595, 'sentry_armor_trim', 'Smithing Template', 'Sentry_Armor_Trim.png'),
(596, 'vex_armor_trim', 'Smithing Template', 'Vex_Armor_Trim.png'),
(597, 'wild_armor_trim', 'Smithing Template', 'Wild_Armor_Trim.png'),
(598, 'coast_armor_trim', 'Smithing Template', 'Coast_Armor_Trim.png'),
(599, 'dune_armor_trim', 'Smithing Template', 'Dune_Armor_Trim.png'),
(600, 'wayfinder_armor_trim', 'Smithing Template', 'Wayfinder_Armor_Trim.png'),
(601, 'raiser_armor_trim', 'Smithing Template', 'Raiser_Armor_Trim.png'),
(602, 'shaper_armor_trim', 'Smithing Template', 'Shaper_Armor_Trim.png'),
(603, 'host_armor_trim', 'Smithing Template', 'Host_Armor_Trim.png'),
(604, 'ward_armor_trim', 'Smithing Template', 'Ward_Armor_Trim.png'),
(605, 'silence_armor_trim', 'Smithing Template', 'Silence_Armor_Trim.png'),
(606, 'tide_armor_trim', 'Smithing Template', 'Tide_Armor_Trim.png'),
(607, 'snout_armor_trim', 'Smithing Template', 'Snout_Armor_Trim.png'),
(608, 'rib_armor_trim', 'Smithing Template', 'Rib_Armor_Trim.png'),
(609, 'eye_armor_trim', 'Smithing Template', 'Eye_Armor_Trim.png'),
(610, 'spire_armor_trim', 'Smithing Template', 'Spire_Armor_Trim.png'),
(611, 'flow_armor_trim', 'Smithing Template', 'Flow_Armor_Trim.png'),
(612, 'bolt_armor_trim', 'Smithing Template', 'Bolt_Armor_Trim.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profile_borders`
--

CREATE TABLE `profile_borders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `profile_borders`
--

INSERT INTO `profile_borders` (`id`, `name`, `src`) VALUES
(1, 'Amethyst', 'Amethyst.png'),
(2, 'Black Terracotta', 'Black_Terracotta.png'),
(3, 'Brown Mushroom', 'Brown_Mushroom.png'),
(4, 'Command Block', 'Command_Block.png'),
(5, 'Copper', 'Copper.png'),
(6, 'Gold', 'Gold.png'),
(7, 'Grass', 'Grass.png'),
(8, 'Honey', 'Honey.png'),
(9, 'Iron', 'Iron.png'),
(10, 'Lava', 'Lava.png'),
(11, 'Nether', 'Nether.png'),
(12, 'Nether Portal', 'Nether_Portal.png'),
(13, 'Prismarine', 'Prismarine.png'),
(14, 'Purpur', 'Purpur.png'),
(15, 'Redstone', 'Redstone.png'),
(16, 'Red Mushroom', 'Red_Mushroom.png'),
(17, 'Sculk Shrieker', 'Sculk_Shrieker.png'),
(18, 'Snow', 'Snow.png'),
(19, 'Spruce Planks', 'Spruce_Planks.png'),
(20, 'Village', 'Village.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profile_pictures`
--

CREATE TABLE `profile_pictures` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `profile_pictures`
--

INSERT INTO `profile_pictures` (`id`, `name`, `src`) VALUES
(1, 'Chicken', 'Chicken.png'),
(2, 'Desert Armorer', 'Desert_Armorer.png'),
(3, 'Desert Butcher', 'Desert_Butcher.png'),
(4, 'Desert Cartographer', 'Desert_Cartographer.png'),
(5, 'Desert Cleric', 'Desert_Cleric.png'),
(6, 'Desert Farmer', 'Desert_Farmer.png'),
(7, 'Desert Fisherman', 'Desert_Fisherman.png'),
(8, 'Desert Fletcher', 'Desert_Fletcher.png'),
(9, 'Desert Leatherworker', 'Desert_Leatherworker.png'),
(10, 'Desert Librarian', 'Desert_Librarian.png'),
(11, 'Desert Mason', 'Desert_Mason.png'),
(12, 'Desert Nitwit', 'Desert_Nitwit.png'),
(13, 'Desert Shepherd', 'Desert_Shepherd.png'),
(14, 'Desert Toolsmith', 'Desert_Toolsmith.png'),
(15, 'Desert Villager Base', 'Desert_Villager_Base.png'),
(16, 'Desert Weaponsmith', 'Desert_Weaponsmith.png'),
(17, 'Enderman', 'Enderman.png'),
(18, 'Ender Dragon', 'Ender_Dragon.png'),
(19, 'Fox', 'Fox.png'),
(20, 'Jungle Armorer', 'Jungle_Armorer.png'),
(21, 'Jungle Butcher', 'Jungle_Butcher.png'),
(22, 'Jungle Cartographer', 'Jungle_Cartographer.png'),
(23, 'Jungle Cleric', 'Jungle_Cleric.png'),
(24, 'Jungle Farmer', 'Jungle_Farmer.png'),
(25, 'Jungle Fisherman', 'Jungle_Fisherman.png'),
(26, 'Jungle Fletcher', 'Jungle_Fletcher.png'),
(27, 'Jungle Leatherworker', 'Jungle_Leatherworker.png'),
(28, 'Jungle Librarian', 'Jungle_Librarian.png'),
(29, 'Jungle Mason', 'Jungle_Mason.png'),
(30, 'Jungle Nitwit', 'Jungle_Nitwit.png'),
(31, 'Jungle Shepherd', 'Jungle_Shepherd.png'),
(32, 'Jungle Toolsmith', 'Jungle_Toolsmith.png'),
(33, 'Jungle Villager Base', 'Jungle_Villager_Base.png'),
(34, 'Jungle Weaponsmith', 'Jungle_Weaponsmith.png'),
(35, 'Plains Armorer', 'Plains_Armorer.png'),
(36, 'Plains Butcher', 'Plains_Butcher.png'),
(37, 'Plains Cartographer', 'Plains_Cartographer.png'),
(38, 'Plains Cleric', 'Plains_Cleric.png'),
(39, 'Plains Farmer', 'Plains_Farmer.png'),
(40, 'Plains Fisherman', 'Plains_Fisherman.png'),
(41, 'Plains Fletcher', 'Plains_Fletcher.png'),
(42, 'Plains Leatherworker', 'Plains_Leatherworker.png'),
(43, 'Plains Librarian', 'Plains_Librarian.png'),
(44, 'Plains Mason', 'Plains_Mason.png'),
(45, 'Plains Nitwit', 'Plains_Nitwit.png'),
(46, 'Plains Shepherd', 'Plains_Shepherd.png'),
(47, 'Plains Toolsmith', 'Plains_Toolsmith.png'),
(48, 'Plains Villager Base', 'Plains_Villager_Base.png'),
(49, 'Plains Weaponsmith', 'Plains_Weaponsmith.png'),
(50, 'Savanna Armorer', 'Savanna_Armorer.png'),
(51, 'Savanna Butcher', 'Savanna_Butcher.png'),
(52, 'Savanna Cartographer', 'Savanna_Cartographer.png'),
(53, 'Savanna Cleric', 'Savanna_Cleric.png'),
(54, 'Savanna Farmer', 'Savanna_Farmer.png'),
(55, 'Savanna Fisherman', 'Savanna_Fisherman.png'),
(56, 'Savanna Fletcher', 'Savanna_Fletcher.png'),
(57, 'Savanna Leatherworker', 'Savanna_Leatherworker.png'),
(58, 'Savanna Librarian', 'Savanna_Librarian.png'),
(59, 'Savanna Mason', 'Savanna_Mason.png'),
(60, 'Savanna Nitwit', 'Savanna_Nitwit.png'),
(61, 'Savanna Shepherd', 'Savanna_Shepherd.png'),
(62, 'Savanna Toolsmith', 'Savanna_Toolsmith.png'),
(63, 'Savanna Villager Base', 'Savanna_Villager_Base.png'),
(64, 'Savanna Weaponsmith', 'Savanna_Weaponsmith.png'),
(65, 'Siamese Cat', 'Siamese_Cat.png'),
(66, 'Snowy Armorer', 'Snowy_Armorer.png'),
(67, 'Snowy Butcher', 'Snowy_Butcher.png'),
(68, 'Snowy Cartographer', 'Snowy_Cartographer.png'),
(69, 'Snowy Cleric', 'Snowy_Cleric.png'),
(70, 'Snowy Farmer', 'Snowy_Farmer.png'),
(71, 'Snowy Fisherman', 'Snowy_Fisherman.png'),
(72, 'Snowy Fletcher', 'Snowy_Fletcher.png'),
(73, 'Snowy Leatherworker', 'Snowy_Leatherworker.png'),
(74, 'Snowy Librarian', 'Snowy_Librarian.png'),
(75, 'Snowy Mason', 'Snowy_Mason.png'),
(76, 'Snowy Nitwit', 'Snowy_Nitwit.png'),
(77, 'Snowy Shepherd', 'Snowy_Shepherd.png'),
(78, 'Snowy Toolsmith', 'Snowy_Toolsmith.png'),
(79, 'Snowy Villager Base', 'Snowy_Villager_Base.png'),
(80, 'Snowy Weaponsmith', 'Snowy_Weaponsmith.png'),
(81, 'Swamp Armorer', 'Swamp_Armorer.png'),
(82, 'Swamp Butcher', 'Swamp_Butcher.png'),
(83, 'Swamp Cartographer', 'Swamp_Cartographer.png'),
(84, 'Swamp Cleric', 'Swamp_Cleric.png'),
(85, 'Swamp Farmer', 'Swamp_Farmer.png'),
(86, 'Swamp Fisherman', 'Swamp_Fisherman.png'),
(87, 'Swamp Fletcher', 'Swamp_Fletcher.png'),
(88, 'Swamp Leatherworker', 'Swamp_Leatherworker.png'),
(89, 'Swamp Librarian', 'Swamp_Librarian.png'),
(90, 'Swamp Mason', 'Swamp_Mason.png'),
(91, 'Swamp Nitwit', 'Swamp_Nitwit.png'),
(92, 'Swamp Shepherd', 'Swamp_Shepherd.png'),
(93, 'Swamp Toolsmith', 'Swamp_Toolsmith.png'),
(94, 'Swamp Villager Base', 'Swamp_Villager_Base.png'),
(95, 'Swamp Weaponsmith', 'Swamp_Weaponsmith.png'),
(96, 'Taiga Armorer', 'Taiga_Armorer.png'),
(97, 'Taiga Butcher', 'Taiga_Butcher.png'),
(98, 'Taiga Cartographer', 'Taiga_Cartographer.png'),
(99, 'Taiga Cleric', 'Taiga_Cleric.png'),
(100, 'Taiga Farmer', 'Taiga_Farmer.png'),
(101, 'Taiga Fisherman', 'Taiga_Fisherman.png'),
(102, 'Taiga Fletcher', 'Taiga_Fletcher.png'),
(103, 'Taiga Leatherworker', 'Taiga_Leatherworker.png'),
(104, 'Taiga Librarian', 'Taiga_Librarian.png'),
(105, 'Taiga Mason', 'Taiga_Mason.png'),
(106, 'Taiga Nitwit', 'Taiga_Nitwit.png'),
(107, 'Taiga Shepherd', 'Taiga_Shepherd.png'),
(108, 'Taiga Toolsmith', 'Taiga_Toolsmith.png'),
(109, 'Taiga Villager Base', 'Taiga_Villager_Base.png'),
(110, 'Taiga Weaponsmith', 'Taiga_Weaponsmith.png'),
(111, 'Vindicator', 'Vindicator.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rewards`
--

CREATE TABLE `rewards` (
  `achievement` int(11) NOT NULL,
  `reward` int(11) NOT NULL,
  `reward_type` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rewards`
--

INSERT INTO `rewards` (`achievement`, `reward`, `reward_type`, `id`) VALUES
(1, 12, 1, 1),
(1, 15, 1, 2),
(1, 30, 1, 3),
(1, 33, 1, 4),
(1, 45, 1, 5),
(1, 48, 1, 6),
(1, 60, 1, 7),
(1, 63, 1, 8),
(1, 76, 1, 9),
(1, 79, 1, 10),
(1, 91, 1, 11),
(1, 94, 1, 12),
(1, 106, 1, 13),
(1, 109, 1, 14),
(39, 2, 1, 15),
(39, 20, 1, 16),
(39, 35, 1, 17),
(39, 50, 1, 18),
(39, 66, 1, 19),
(39, 81, 1, 20),
(39, 96, 1, 21),
(40, 3, 1, 22),
(40, 21, 1, 23),
(40, 36, 1, 24),
(40, 67, 1, 25),
(40, 82, 1, 26),
(40, 97, 1, 27),
(41, 4, 1, 28),
(41, 22, 1, 29),
(41, 37, 1, 30),
(41, 52, 1, 31),
(41, 68, 1, 32),
(41, 83, 1, 33),
(41, 98, 1, 34),
(42, 5, 1, 35),
(42, 23, 1, 36),
(42, 38, 1, 37),
(42, 53, 1, 38),
(42, 69, 1, 39),
(42, 84, 1, 40),
(42, 99, 1, 41),
(43, 6, 1, 42),
(43, 24, 1, 43),
(43, 39, 1, 44),
(43, 54, 1, 45),
(43, 70, 1, 46),
(43, 85, 1, 47),
(43, 100, 1, 48),
(44, 7, 1, 49),
(44, 25, 1, 50),
(44, 40, 1, 51),
(44, 55, 1, 52),
(44, 71, 1, 53),
(44, 86, 1, 54),
(44, 101, 1, 55),
(45, 8, 1, 56),
(45, 26, 1, 57),
(45, 41, 1, 58),
(45, 56, 1, 59),
(45, 72, 1, 60),
(45, 87, 1, 61),
(45, 102, 1, 62),
(46, 9, 1, 63),
(46, 27, 1, 64),
(46, 42, 1, 65),
(46, 57, 1, 66),
(46, 73, 1, 67),
(46, 88, 1, 68),
(46, 103, 1, 69),
(47, 10, 1, 70),
(47, 28, 1, 71),
(47, 43, 1, 72),
(47, 58, 1, 73),
(47, 74, 1, 74),
(47, 89, 1, 75),
(47, 104, 1, 76),
(48, 11, 1, 77),
(48, 29, 1, 78),
(48, 44, 1, 79),
(48, 59, 1, 80),
(48, 75, 1, 81),
(48, 90, 1, 82),
(48, 105, 1, 83),
(49, 13, 1, 84),
(49, 31, 1, 85),
(49, 46, 1, 86),
(49, 61, 1, 87),
(49, 77, 1, 88),
(49, 92, 1, 89),
(49, 107, 1, 90),
(50, 14, 1, 91),
(50, 32, 1, 92),
(50, 47, 1, 93),
(50, 62, 1, 94),
(50, 78, 1, 95),
(50, 93, 1, 96),
(50, 108, 1, 97),
(51, 16, 1, 98),
(51, 34, 1, 99),
(51, 49, 1, 100),
(51, 64, 1, 101),
(51, 80, 1, 102),
(51, 95, 1, 103),
(51, 110, 1, 104),
(40, 51, 1, 105),
(52, 1, 1, 106),
(53, 17, 1, 107),
(54, 18, 1, 108),
(3, 111, 1, 109),
(13, 19, 1, 110),
(16, 65, 1, 111),
(1, 7, 2, 112),
(1, 20, 2, 113),
(6, 3, 2, 114),
(6, 16, 2, 115),
(7, 4, 2, 116),
(5, 5, 2, 117),
(9, 19, 2, 118),
(12, 1, 2, 119),
(13, 14, 2, 120),
(16, 6, 2, 121),
(17, 11, 2, 122),
(20, 18, 2, 123),
(23, 17, 2, 124),
(24, 13, 2, 125),
(25, 2, 2, 126),
(29, 15, 2, 127),
(30, 9, 2, 128),
(35, 10, 2, 129),
(38, 12, 2, 130),
(56, 8, 2, 131);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reward_types`
--

CREATE TABLE `reward_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `reward_types`
--

INSERT INTO `reward_types` (`id`, `name`) VALUES
(1, 'profile_pictures'),
(2, 'profile_borders');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `volume` int(11) NOT NULL DEFAULT 50,
  `image_size` int(11) NOT NULL DEFAULT 50,
  `is_set` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `table_mappings`
--

CREATE TABLE `table_mappings` (
  `id` int(11) NOT NULL,
  `control` int(11) NOT NULL,
  `slot` int(11) NOT NULL,
  `hot_key` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tips`
--

CREATE TABLE `tips` (
  `id` int(11) NOT NULL,
  `game` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `item` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tokens`
--

CREATE TABLE `tokens` (
  `user` int(11) NOT NULL,
  `login_token` varchar(255) NOT NULL,
  `is_expire` tinyint(1) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tokens`
--

INSERT INTO `tokens` (`user`, `login_token`, `is_expire`, `id`) VALUES
(4, 'f97d95fc25e971b8944160f3b6e64eab7738ed09756263d074aeb5fdd82c512915cbdd10c114d27401108ec18295f6a5', 1, 1),
(5, 'f0fabc7b2479106eacd8d07d51ffd53a33796763af67b3b3b7601dc41855da3c63109a03eb92a89b7e207f05834c02c7', 1, 2),
(6, '49bcb16d1f86c981f9a5781edc554220769c593bf1428d45893d99d50960bff4b21b2eb2234e45302edfedcdc904b8d3', 1, 3),
(7, 'd04b17ada032c772868c4ab33ce7a95998494936bf41f39821852729f9fd3682217174011a1aa6463159b7484a158105', 1, 4),
(8, '5323531dea844d67f22837196972134c1893d895a441650d707493387b0fcf2b5e308e23958a40254c41f68c553e9c7d', 1, 5),
(9, '007f6f49b66b395f3ff69abbfab4be9c689f42c0d92b7b14326fe1956ffbc5665db0215a7e4b5b16aacfaf24f2e77e78', 1, 6),
(10, '7a7ed99bdabbac2319bbd8e852261f6f9337a60e6628f1481185d5d050fa192ac4f2799203bf17b879494e1bff4a4c1a', 1, 7),
(11, '77b3bcf43e9ba1cef06d9c21c71e085e0967d9d0b3efc938d49a64233df42fae179852e62bccd90f50322baff49db670', 1, 8),
(12, 'dd0587ad442bb49d8dd4b722b2e2a97a2c8dcc55db819c4a6b893fbc2eb0d481e092e2c5e0aca6acb4ae8bf784be983b', 1, 9),
(13, 'efe9ffd63e0ea350e49a8e7748f5ebeeafc0c028d4ecdb034b9f4dbe0e01e05fb2932fdecc00bddaee0e750c3ae18706', 1, 10),
(14, '2e578e9e5b04958254e280b5188542f1de2cd8465acc5a6e3eb012ec36b41e197ba957441310d17b880ae190cdb9df2e', 1, 11),
(15, 'aace95caf6ae0aa7876526fc3a9bfe6458af6a07065494ecddc9657ec5fde61c7a1a08a2482a25a375339c4ae151f169', 1, 12),
(16, '010757391c140eaf34b22842d2554c0c306d2c47c9037852ab773e511f4233db08be7d2586614585168cd555e4000104', 1, 13),
(17, 'ea7b81b2c92e47cde92791d4fca4056793efab1514b4f2925ca09bcebd45cd75e1cd54f8e4a8c1cf88e4c0fa9c85c0a5', 1, 14),
(18, 'fc254b60f0129dda8b69f128b68f3cdcc9d339e1decca2e609e816f862beebd2d94c6f898a9817783f90d9b450f30943', 1, 15),
(19, '6c63640a6ebc3245f1676359033b2567ddce8c93f6a1997c59053629dd267f334aba703261ed676cee629188e81d6c22', 1, 16),
(20, '74238e1dac2ce06d3d41518a06bf44168c66eb447d67137d3194c92a440113679b3b04fb6bd1502d6a1417fe4d4a0f20', 1, 17),
(21, 'bbbc3136791601176d52b5354068bbe8b05fad46f0b1ed43fa079ecb9d1631488ec9d2ca30528a6bd1b8ed3d2cbc1dec', 1, 18),
(22, 'dcde0ed66507cd10c9bfee37292c29d11990fad08a4a71ed381ce9b08898f7a1166c26d1f3a32a18cf16c110d4f48301', 1, 19),
(23, 'e2d49b1892a76622549d9dd439606cef10816f9492bf09ebdd421665694aad22ab6775e10bc5013759ac35ecb71ac4f3', 1, 20),
(24, '1a1d2b0f481b6afe71ee1577e4d7972a04b5f8a590ec403259bd385728a077f7bc6c406065f877b73bae0e28bcebaefb', 1, 21),
(25, '65b613df58e6b8d8d9c351c02b301fb9bb4413e0359c31c447d6659d9e180ba68f011220e1969329330c53943b745af1', 1, 22),
(26, 'c8938ba0468511e3b6da4e45a3360c949a8f3819d6051ab52132f15adb5124dc9320695a5d276847e367bdc7a4c76408', 1, 23),
(27, '9391b1280a2d2b5c46d279de56befc1a806557828f15e372f3321b0aa70e7706324242e7bcc0181ebe8774db46a78a0e', 1, 24),
(28, '650bf458a38406f10d2a7cd06b95c8d3c0c7d69bd9656058b224570f7f47180cadd5e24817a609a1ac5468a94ca781bd', 1, 25),
(29, 'b2fbd3b7fa76cf78f53d5a261d6e9ef3fac252970595be1dc64c1b072f70650965f2504d388a468fbee36e57edea2156', 1, 26),
(30, 'ccbc442c138ce88093a4745236d5d6831eae1a2afca1dc6f66e90b88a9b6127783182bfb101655619916c8c3fce0d10f', 1, 27),
(31, '9992c2119f49d293edefe7f24e033f6cdb47f264199d4962e1d5f17c2995a822cd8e7d26a5b00dff0b76b540c3ca1567', 1, 28),
(32, 'c71155fdd0d34951438d8f4185495e73f140cb142f346ae3a945862a8ff5f3b186665c3d115bf0c0d017375b52fb0fec', 1, 29),
(33, '62f08075cc6c35d9885feecd3a12d6e29a46df76855d2ac41900eb01fcfb19dac59ee966b271f9c5c95e6731ba098c43', 1, 30),
(34, '0f6d6740e0504124a1ecc8717fc8f9a6610ad09314bdb527affb4458c1bff1e33f295ba9e8a66816fcbd9f93837a7b38', 1, 31),
(35, 'b5368571505f32b3919e21e84142f3cf1afeb36eb2a3e514df077d4ced25012cae6f18d8b2464a09219dd66d3136d21c', 1, 32),
(36, '360cb126df927463f7a00d9d766079c3b9411ea278a19fa87fbfd12fc7dbbc1688c3c392e4e0ef204b4641be4d06c261', 1, 33),
(37, '9634dcf411c3fc101455139e90d725e1861364d3d308922a53eea6d42b207c6efe1deab5a14af886129a0171b3da8879', 1, 34),
(38, 'cda34009e77d0dc0a6487613aa2726e79351c56fbb4a43f69ad9fe9b661813caae296a33e1602b46995e68469ffee58c', 1, 35),
(39, '6534f028bb82c2e0fd97e1818fd6c4a7e1417d934aaeef4ff0053b3125e7280081de1f1de2f2d41f82b5a8dca241008e', 1, 36),
(40, '9e1b1db9be2d79f125842fc2aa6c1c000ddec0c23a3d6b55ca77f187e8923693c433b1915e410f9ca2db1c0a829d909b', 1, 37),
(41, 'a9116645d347a7dee92e09e957394ef279518b05865b5e2b64600f5eee070d6faf2bf5342b80df0b1a0d5c84ac220532', 1, 38),
(42, 'e5005505a03ffefde82497801b5c283e9597c4f0d61d77a8c7495b1ff8f83324736323920e9ef2b542a68c5527659783', 1, 39),
(43, '288763da3bb84118ff706a0ef599a7705ad3d370c31b7ed52fec290ac28be521f399b5a4950909a5fbf198235d76b2b3', 1, 40),
(44, 'fec2891cf910f82f580dbf2f5954c061dbaca368ecf6d4309a36b04d2b54a9b0d13f57a5705f9a0ae5af6460b3855a6e', 1, 41),
(45, 'c3a5283642d91c62810a432e5a7cf62696806084252cb2942e3ee3e64280948a77cd220da773d27ad90cb8c7d12a6ce0', 1, 42),
(46, 'a0fad65d27e1efc99cd91b70300c087b864f5a2004bc8d8fc68e4e33371a3c9dd665099d5e09ab3313d2c739768971b8', 1, 43),
(47, '94b92eb5e91c311cc6cf522ac2560f21858f2d375f956947eab57adff01d363e1bb0d5b57fd31ea42c66a49abf45f7e9', 1, 44),
(48, '9c92eb157257184b92f82a4e9cd4016abb23b3bf0251f0fa09a61d678be5aeb0c24fe12833ae922fa4db3bf26814ddcb', 1, 45),
(49, 'b55f9d92027ba1d725fac78e7b216f24e97506890098f7589861df6487082e1eda6e11ede1c92a8e077ca278f236c53d', 1, 46),
(50, 'f7af3aef22fc434781ba6739ed66b8d48ba25c84a41f1ac54c57a7c11f577d64fd7f7ce61cb3c2f9e5bf9ee9d04076f9', 1, 47),
(51, '728af1f6300a13bf1b80d7e491f117533656aa22a88fcd136ca9f4d990eda23c431cb48eec4e2616f9aa3c28e8adced3', 1, 48),
(52, 'cab4055c85e7fb112b11bf47e33c996e9d141dbabc9b299c96d5f4e633ca549a3a90298fddf99f6d81262ca2b1a98e48', 1, 49),
(53, 'd0264fd6e1b84eead6b1a9f6cbdc8ce6d6c092940a4598442897d87afbcf3950b88d23d3435cee113435af19690b5f97', 1, 50),
(54, '1e0f39e395e1541ff918cdf8f8ba7302c0dee7cbedd84ea7ae52bad99a3523300dd8725d6528440cd13b2d5411724a27', 1, 51),
(55, '17dc3e06bb6da1f8be0205d4f371c53ac081ef383d1368804429dbafc3fdd9a1c389d5fdd9f42b59c4cccd668bb2b112', 1, 52),
(56, '87ac35b01d0ee1697c945ed850debe78dcff9e1352aa6bdb6ebed0901b8d877454d414537b96ccd75dde18c9bf9d8409', 1, 53),
(57, '494a6f7fd8221c6ef1482f2b4df80d77063738272a6462f7654ac85d2f3c396f64b2121aff9a312bbb73588eb60e5145', 1, 54),
(58, '1584dcdc4c333c9351895b2dee1e8f8a4b4c13f1f636215ba1e45b6278be18ec1c6bbcfe5fd51ca9e4665e7ed4b0df9c', 1, 55),
(59, '3db7c93b149e6dbdcbb24f962ef8be049531bf5c3e5007516e8fefc1770ff71d05756c9b853a2866e7b9ec9979852bb2', 1, 56),
(60, '58b97916eba906b61484b4788ff9da4e9f2ae87047c37b1c09df87f9b703f5f5e11c2838afe39ef098e7f66366d98815', 1, 57),
(61, '7afc73c40678e6e03c244ae8297ff433c705bcd2dbd42356dba65d95190d7b62710cd9a0451ca0d9d1aaf378094f303e', 1, 58),
(62, 'd49626ccf5855bc1894c4f67f8864840a127ec5495ad2dc8dac53f7d0d25a452ae8696d9e98c7dfcd1083f77ebaa17c2', 1, 59),
(63, 'b4fbc0271f62906df99aaef8bef58822f05f7b4534a4235684c8f847a114713415f72ed350af85e647d49b0743b841da', 1, 60),
(64, 'd5d8477565809ca4c579427477d36c5fa3120d90fe5feed06220ba2ac00afba41350506b560d79b6a62c7a3e6af22701', 1, 61),
(65, '340b50d0e61f16a1f56ca550087c5f5b3eb5a8946932fc39265599f82cd5cba62dce540f8f1a0091c9e0611c686065cc', 1, 62),
(66, '82b384a27c463d0cfd000a942ab57d174efd69d31163de35b86cd2536f3d4e0fffc0ee6c00d51a672e9820382f7887a0', 1, 63),
(67, 'a1f37506a62102f089a477746aaa324f8019cdb9531450bb0e94f0e89fc235871d4f8b6baa36280c962d6e711755513c', 1, 64),
(68, '6ea45a68a31f6a843a9e074761b6ec5401b38221f8a9aa27e9799eb2e6b6b303ae820958ea018b61da1893bcd7172be1', 1, 65),
(69, '0ca8c95c872d2ff816ddc623f5d8eaa6a154c2bb12b2a5cd03bc335e8ff31fb46722b39d7c5c7c7c690d1c3d21ea3686', 1, 66),
(70, 'e18ec7003c94d74c5ecd3d0c1be5485f2a5038ec79d1c8f5fb5dec0afaf99f3be867663fa7430e2c67d0e62bb274e807', 1, 67),
(71, 'c2ad56833ed2e4e268bca812ad69c74e5e18468fcc4ea63ffd37bc9662b7148ea9d5cf1e78524c216d4ba94435887e31', 1, 68),
(72, '4291268283a2a35c7bdbc206f48cd0a99c355660c1e20a618ffae2ea09b5e51e2b22f8cdc7b72a830cf542f22ef51452', 1, 69),
(73, 'e597814e679d85d7c23a01f63d9a418a23de97e4935ede5b8b97226fdf4f220ae5c1fcafe85337f1aa2afb3acc00849f', 1, 70),
(74, 'c3567ef6c6116502b274ab2a1f338f93658feef2487a5621ec63354ca8c5e6bdb03f5e36461a6349c81dcf90517db440', 1, 71),
(75, '14aaf219eb9c6d2ac388c0c793b4b915ad6ffb2c303c834dbba0615f617bab5ee4b471d1da643c96f657dbd1e70194de', 1, 72),
(76, '4bdcc0b8ece0e38216d3f02d5869edf9abc00fca01cefe0d6a952aaf2bc3e8614a51e7fa060301b18fda6af82dbd499c', 1, 73),
(77, '16d24154cb4c25208ece8c04c8cacbb9f968f4c8d172790a4519c9814a1a085b9481753e925c4e1ca37becdb5efd3d9b', 1, 74),
(78, '92693e9408d6bc7f31029a83308866ae090ec719c418283bcdc6f6a04238b4af028535067b6c76415704c8bcfeb6a1bd', 1, 75),
(79, 'a071ac3f6de78f89675068659e9cdc5ad824d8f0ae39a3f336eb6cb1ad61d856fa3fe8fb102435a22fea950ce3678d5d', 1, 76),
(80, 'f60330429be7bb80d16b1ec1060663206cc1fabfc15ce63622bc6f5e587a5f45164e7bee3d5fb2285b9fd437c42fa17e', 1, 77),
(81, '999974e6b47fda4bd11e8a5af0f213a5eb5504d3cd6ccb4af99c4d1a3e7865d64f2e061e014f9abd77d6f4d488f4c699', 1, 78),
(82, 'a4c108d929264010b10860dea486867888645c2ff71532b67d2d68345f662a5fae5d11a0dae0adf873edb0951fb727fb', 1, 79),
(83, '17737d1fd6da74a5ef261212f765dffd6f2f25db379e1e7b5ac0f6729eb4e478e5cd3af892a54f7478730a2f258bf55b', 1, 80),
(84, '12693aa30e82bb49a3e0169ac7b762d8bca3c2b5e55327c12544c1d7120a4f6efdc660bbf710539a70e6580a85bdb4f6', 1, 81),
(85, '5f3e67048233ed62d17351e161a76c9aa91b2704362333544951ca07f1cbc6029c59e6b72b7b7c5cc2d768cd183c7a12', 1, 82),
(86, 'e4676b67051a53594e581a60d5c669838a38155b73b0f3610802d111fe56bc061cab92b9d48504f090e75be90d237fbb', 1, 83),
(87, '6cada0e3d0b7c4e4293f2093c2c061c170fcea0be1cddb50fa7a8162d54df8ab10e873645e67213ef74c8c4ca74edb4f', 1, 84),
(88, 'd8f3117d1a9470b283cc85b3a5ee0983dcfe60fb6ad2c5b4e1fe5019469a7a3d1b924de82fa5508171d4abb34b7642df', 1, 85),
(89, 'e9f07256958e9dc6db88dffaf1f43a0a02059fad2327f7973873fd8acb34d8582b7142fb8783fe65ffbe61d153f54fea', 1, 86),
(90, '1dd099800eafc8ec3eafdac8a28438ddb2f29cee7d6fcc0364c95874e59f5b928c72e50b1790548da3718326616e2afc', 1, 87),
(91, '1dc57f6376104dd8a6049cde303a224ac45b530eb62c3b8272b6d1e405a28963344c73c453ad73c417080192840ff026', 1, 88),
(92, '007e4973f1d9c42b1db98073a1bef5ea11d7f224e7be90c776c6605f074b7d5562444dfce915f7e7e0c2c288ac99cd52', 1, 89),
(93, '7e3034be4028c91a574fe3afc1ae2b601bdc792e124ae6c170c7add67b3126ee0babc9ddeb14c9b54807d5204c0ab4cd', 1, 90),
(94, 'de50029b4ae50fdff46da4d6f92a6df1d155289c79b8c0270cbe9da3d026a7c2e72c4f40fb7fb93af1b404a2c8e04c51', 1, 91),
(95, '77d72d525438733a517f7d58ebb986583b987373322334315d927ed1eded5857789398d013b5a594d5ceec0f76c12a99', 1, 92),
(96, '91884aa153e6495c2b435f142913390e545823961bcad203297b36b32345be4adac0f2ed5ed52f01f3351daca827c403', 1, 93),
(97, '0c6c82e0125d11d74692536b7aacb6ee36bc7df3e77bb0f05aeb67bc7c9de4c2d19302ae97eaf8415e421eddb5e8fee6', 1, 94),
(98, '8fd5fd0b1380a25d14be04420646981b66c3f00741b5675409271ef8118ee8a3fa35405bb06b8be4477288838efcedba', 1, 95),
(99, '1e0e76ae2d463a6560f0fd0ffeb36b2cd3b2f56fc34b67494aa6e41e610644620b7c0267ebb90840602a2132a3115d06', 1, 96),
(100, '30685ff5f50f98b68df2cc686cae226c33e918200d945cb732dc4947fcd78701b4e892eac612869693134659635f9723', 1, 97),
(101, '20b683af4521df178ff6c2b07836a1b414e7ea8d8d6a200939aa61b9ef35948d9c092a35249e1140d480e8b5d2d2d0d7', 1, 98),
(102, '992908ff4ce986c123cd61560952a1495d5acab0e7857c31f79e2c643a7f851869f6a1f8fb451b00a75b6513777a4f94', 1, 99),
(103, 'ac3469ef72524137a6ad0d782b4541b1fd617257741b7d6153cd81a24af65778e7a19ced1bc7dc5b64abd7a768731bfb', 1, 100),
(104, 'b3c77505d64a950adfe54297e1d1385706445eb56ca074a284d5ec8cc89c90634705ab7d94c96a360e80550bc9ff5e14', 1, 101),
(105, '44c4ab8fb23b9eaf621a9d40612ae88ced12b2955db32193705b23d5460120509e2441d1d77e52555f37bd0107d32650', 1, 102),
(106, '3c12b20b69ee629558001d0355198609df49bf8f1fdd98f45a3ae68a302dfe6016ed974c146638fab085306d476a26a8', 1, 103),
(107, 'f9a999a6e69c8439ec7170605f9c05645dbc48803d992e16fe53894d590b0e7b8490eaaf50ddc951cc24741a8db5c649', 1, 104),
(108, '42ef8856fc5cff362a87d8aec328e90a4665fb35db3ead3f9d90cbcca325ac2bbe35c74a6775ca88a860dc8711e727e4', 1, 105),
(109, 'c342dcb3e23db2afd1c92d3b9d48fab3366e72f80153e0ccca4c115443bbd797fd62b421bca09b91f2dcb545cb8901fb', 1, 106),
(110, '75eb1d7f132584aecaf1a0bd9ec897bc56ea24838715fc78a441df05a14c45e7ed41889cd09c755e06d0195ebbbb9bdc', 1, 107),
(111, 'a34c99dc0864bfa4681c51e89b77b78634f263a83e0597556aab6d970985d8c43ef8d9eab379240b3f3d324cf29e88c3', 1, 108),
(112, '82785918f33edb6e62b6fe48feabbdcfaff926f6b15059d8c43c47882eff39a5caa9ffc3ce723d701af414e336b1b274', 1, 109),
(113, 'f5383fc4ed487e977ea8c4151cacec9e0463c23165689999a6a478555ab3a84d6afde0b431b6d1847667539938e03ebd', 1, 110),
(114, 'e509b7301985590bfec7efc482de322e4936e91b9dd423dd59abaa9a418e3d5872ecdeb80818db21775f1d9c3f9b59d0', 1, 111),
(115, '4dd74c46fa7774b9836a0593eece086c0202c26d98ff1c0846dcb35f5793de7c84fc286f5c26ec6f8e05cc7525b05fe1', 1, 112),
(116, 'a0265eb5c5f231660eb4d097d3f0238f0a74bc1f83c212438cdfe59a9c49f16df1ac5fe3bb072b15dcde159c8e02e81b', 1, 113),
(117, 'd76014b0b9fa9f682425f56972df8f30c6522de43efe680b73eb047e6dfdcca9ab1669b76f2e0614bf99c5d7f8425028', 1, 114),
(118, '7a7637491bcc4b7a6de3a04387b1417afda70f847c51d0a2d4b42a1d601e7ac42c5e839395fa8a27f65f35883b474bb2', 1, 115),
(119, '36a2ddac5f3a1c6c6a6d7644f17bdc3a4e661d98d4b2ad410b5a17d301ef3d74f518218537fd742ee9ea7e4fc583d492', 1, 116),
(120, '64521b494810c4f9fe480fab594d34bc0c3fddf20268dcd8c8fe395e19e6e9c15a79904a5c192762b7d1753b05835b44', 1, 117),
(121, '0e9afb5e0d7f949d1f44c9a26ed079d36b245d659c35a33ae506a77afc75f0cf9b1d4e73ee850e9d7105f7e188693a28', 1, 118),
(122, '81ca65e8e75c0ea3ba574a2b49ceec9b4af45599673dc39e402171fb34b294b9c6e3a630e56cbc4ec32e7e546742850b', 1, 119),
(123, 'b7b1f4c16f86aaa9fd315b27d88401a38e37d388019936e64f0cc816f18e02f50ee5b3aded2814708a625308d99dafc5', 1, 120),
(124, '18c46f6a94ee100bb6e1757f1f692dbc689dec3a9cf29fea50d8849d1564b860137d22ac4d4eedcc3c3c9b5a46318d66', 1, 121),
(125, '8310bb7a9346eb43c3e25b2275619eae6a3ba010adb7968aea456e2c2c1894e3ea11d383eadef0b725b48e0f67e2ec75', 1, 122),
(126, 'd13a8132da52614e869e1654aaa68dede3ce85faec6bba62ea2ba0f69117600a29b5199d790eed9ddfcfdfddc2a1e308', 1, 123),
(127, 'aa830959f96c2a0f2c4d8c4eafc3d6e0b95c864a9769bbc03152ae9d6c3253605335f0ea12d0ea22e3322c8b1a694bfb', 1, 124),
(128, 'c182c0a7288ef9335ba0827a8a77e8445dd7b5bcbd26924b6066a9e59595982c30e39586883eb39f68ad8724cc038a84', 1, 125),
(129, 'ef622eba5740d9017103db12105e6bab500d2f6caa8c1872c6db686a8e4f0b6a11c0106482885ad7c33608558e8e28cb', 1, 126),
(130, 'f8ba1d6726d6dbbe9896745a907faaa40daf9cb76c9b14231002e6e1ee8483ab3cdcf0f7c2ee3d6d45d63b097dd3339b', 1, 127),
(131, 'ba53bfa666b4b3c04850226cea1707e6fec9f99e0d0cde8f711cd148fa2ad76846f1941f5f914fd14f4c3902620c47d6', 1, 128),
(132, '1076c5c3f3fe5558c02b968d01356d57e6cebf3436efd652192b8dae99f553384dc74c9d405dfadee9674f991a7dd97c', 1, 129),
(133, '2f3bad06a425262a1f0780072a08dfbb3fcf7f96551abb78f316e3118997d8f41f9b6ccb1a7a3b3f0e9bbb75d7c6370f', 1, 130),
(134, '89ac4be9c9f66e3e24b15ba5816fb3690873c2f6627252b2ffe46868f2b167836a6536a4ecce1ef1278862656ab43b19', 1, 131),
(135, '53232503664696f35f296c1d680cbf406956eae4577cf4bc3ffef4eacc33e77930d7f1f8486307dc19d42c0423e63a97', 1, 132),
(136, 'ca21d92414bbf28586f678ecc2179efc1b8c4e4cb8997d68ec82e808a52cd1baabe17adf57380f4cc6156a49136f1cac', 1, 133),
(137, 'fdd3a007c4c21c0f48e95ebd23c6f699ef7df802d2e53dc62b0d5722240773088060a2c7184b775b389e07c130dff8a7', 1, 134),
(138, '238196fcbc77781242953b69ec9e87d557ee0a1b1691db6187c4e3ccfa09c28f0dd6896527de3b022de04408818a663d', 1, 135);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(16) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_guest` tinyint(1) NOT NULL,
  `socket_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `is_guest`, `socket_id`) VALUES
(1, NULL, NULL, NULL, 1, NULL),
(2, NULL, NULL, NULL, 1, NULL),
(3, 'validUser123', '$2b$04$Xr6yJRiiLbCBD.USYnzXZeO3u5zMy5b4lZZsOR6DjSa/LcJTrM8X6', 'validemail@example.com', 0, NULL),
(4, NULL, NULL, NULL, 1, NULL),
(5, NULL, NULL, NULL, 1, NULL),
(6, NULL, NULL, NULL, 1, NULL),
(7, NULL, NULL, NULL, 1, NULL),
(8, NULL, NULL, NULL, 1, NULL),
(9, NULL, NULL, NULL, 1, NULL),
(10, NULL, NULL, NULL, 1, NULL),
(11, NULL, NULL, NULL, 1, NULL),
(12, NULL, NULL, NULL, 1, NULL),
(13, NULL, NULL, NULL, 1, NULL),
(14, NULL, NULL, NULL, 1, NULL),
(15, NULL, NULL, NULL, 1, NULL),
(16, NULL, NULL, NULL, 1, NULL),
(17, NULL, NULL, NULL, 1, NULL),
(18, NULL, NULL, NULL, 1, NULL),
(19, NULL, NULL, NULL, 1, NULL),
(20, NULL, NULL, NULL, 1, NULL),
(21, NULL, NULL, NULL, 1, NULL),
(22, NULL, NULL, NULL, 1, NULL),
(23, NULL, NULL, NULL, 1, NULL),
(24, NULL, NULL, NULL, 1, NULL),
(25, NULL, NULL, NULL, 1, NULL),
(26, NULL, NULL, NULL, 1, NULL),
(27, NULL, NULL, NULL, 1, NULL),
(28, NULL, NULL, NULL, 1, NULL),
(29, NULL, NULL, NULL, 1, NULL),
(30, NULL, NULL, NULL, 1, NULL),
(31, NULL, NULL, NULL, 1, NULL),
(32, NULL, NULL, NULL, 1, NULL),
(33, NULL, NULL, NULL, 1, NULL),
(34, NULL, NULL, NULL, 1, NULL),
(35, NULL, NULL, NULL, 1, NULL),
(36, NULL, NULL, NULL, 1, NULL),
(37, NULL, NULL, NULL, 1, NULL),
(38, NULL, NULL, NULL, 1, NULL),
(39, NULL, NULL, NULL, 1, NULL),
(40, NULL, NULL, NULL, 1, NULL),
(41, NULL, NULL, NULL, 1, NULL),
(42, NULL, NULL, NULL, 1, NULL),
(43, NULL, NULL, NULL, 1, NULL),
(44, NULL, NULL, NULL, 1, NULL),
(45, NULL, NULL, NULL, 1, NULL),
(46, NULL, NULL, NULL, 1, NULL),
(47, NULL, NULL, NULL, 1, NULL),
(48, NULL, NULL, NULL, 1, NULL),
(49, NULL, NULL, NULL, 1, NULL),
(50, NULL, NULL, NULL, 1, NULL),
(51, NULL, NULL, NULL, 1, NULL),
(52, NULL, NULL, NULL, 1, NULL),
(53, NULL, NULL, NULL, 1, NULL),
(54, NULL, NULL, NULL, 1, NULL),
(55, NULL, NULL, NULL, 1, NULL),
(56, NULL, NULL, NULL, 1, NULL),
(57, NULL, NULL, NULL, 1, NULL),
(58, NULL, NULL, NULL, 1, NULL),
(59, NULL, NULL, NULL, 1, NULL),
(60, NULL, NULL, NULL, 1, NULL),
(61, NULL, NULL, NULL, 1, NULL),
(62, NULL, NULL, NULL, 1, NULL),
(63, NULL, NULL, NULL, 1, NULL),
(64, NULL, NULL, NULL, 1, NULL),
(65, NULL, NULL, NULL, 1, NULL),
(66, NULL, NULL, NULL, 1, NULL),
(67, NULL, NULL, NULL, 1, NULL),
(68, NULL, NULL, NULL, 1, NULL),
(69, NULL, NULL, NULL, 1, NULL),
(70, NULL, NULL, NULL, 1, NULL),
(71, NULL, NULL, NULL, 1, NULL),
(72, NULL, NULL, NULL, 1, NULL),
(73, NULL, NULL, NULL, 1, NULL),
(74, NULL, NULL, NULL, 1, NULL),
(75, NULL, NULL, NULL, 1, NULL),
(76, NULL, NULL, NULL, 1, NULL),
(77, NULL, NULL, NULL, 1, NULL),
(78, NULL, NULL, NULL, 1, NULL),
(79, NULL, NULL, NULL, 1, NULL),
(80, NULL, NULL, NULL, 1, NULL),
(81, NULL, NULL, NULL, 1, NULL),
(82, NULL, NULL, NULL, 1, NULL),
(83, NULL, NULL, NULL, 1, NULL),
(84, NULL, NULL, NULL, 1, NULL),
(85, NULL, NULL, NULL, 1, NULL),
(86, NULL, NULL, NULL, 1, NULL),
(87, NULL, NULL, NULL, 1, NULL),
(88, NULL, NULL, NULL, 1, NULL),
(89, NULL, NULL, NULL, 1, NULL),
(90, NULL, NULL, NULL, 1, NULL),
(91, NULL, NULL, NULL, 1, NULL),
(92, NULL, NULL, NULL, 1, NULL),
(93, NULL, NULL, NULL, 1, NULL),
(94, NULL, NULL, NULL, 1, NULL),
(95, NULL, NULL, NULL, 1, NULL),
(96, NULL, NULL, NULL, 1, NULL),
(97, NULL, NULL, NULL, 1, NULL),
(98, NULL, NULL, NULL, 1, NULL),
(99, NULL, NULL, NULL, 1, NULL),
(100, NULL, NULL, NULL, 1, NULL),
(101, NULL, NULL, NULL, 1, NULL),
(102, NULL, NULL, NULL, 1, NULL),
(103, NULL, NULL, NULL, 1, NULL),
(104, NULL, NULL, NULL, 1, NULL),
(105, NULL, NULL, NULL, 1, NULL),
(106, NULL, NULL, NULL, 1, NULL),
(107, NULL, NULL, NULL, 1, NULL),
(108, NULL, NULL, NULL, 1, NULL),
(109, NULL, NULL, NULL, 1, NULL),
(110, NULL, NULL, NULL, 1, NULL),
(111, NULL, NULL, NULL, 1, NULL),
(112, NULL, NULL, NULL, 1, NULL),
(113, NULL, NULL, NULL, 1, NULL),
(114, NULL, NULL, NULL, 1, NULL),
(115, NULL, NULL, NULL, 1, NULL),
(116, NULL, NULL, NULL, 1, NULL),
(117, NULL, NULL, NULL, 1, NULL),
(118, NULL, NULL, NULL, 1, NULL),
(119, NULL, NULL, NULL, 1, NULL),
(120, NULL, NULL, NULL, 1, NULL),
(121, NULL, NULL, NULL, 1, NULL),
(122, NULL, NULL, NULL, 1, NULL),
(123, NULL, NULL, NULL, 1, NULL),
(124, NULL, NULL, NULL, 1, NULL),
(125, NULL, NULL, NULL, 1, NULL),
(126, NULL, NULL, NULL, 1, NULL),
(127, NULL, NULL, NULL, 1, NULL),
(128, NULL, NULL, NULL, 1, NULL),
(129, NULL, NULL, NULL, 1, NULL),
(130, NULL, NULL, NULL, 1, NULL),
(131, NULL, NULL, NULL, 1, NULL),
(132, NULL, NULL, NULL, 1, NULL),
(133, NULL, NULL, NULL, 1, NULL),
(134, NULL, NULL, NULL, 1, NULL),
(135, NULL, NULL, NULL, 1, NULL),
(136, NULL, NULL, NULL, 1, NULL),
(137, NULL, NULL, NULL, 1, NULL),
(138, NULL, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_achievements`
--

CREATE TABLE `users_achievements` (
  `user` int(11) NOT NULL,
  `achievement` int(11) NOT NULL,
  `progress` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_collections`
--

CREATE TABLE `users_collections` (
  `user` int(11) NOT NULL,
  `collection` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_profile_borders`
--

CREATE TABLE `users_profile_borders` (
  `user` int(11) NOT NULL,
  `profile_border` int(11) NOT NULL,
  `is_set` tinyint(1) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_profile_pictures`
--

CREATE TABLE `users_profile_pictures` (
  `user` int(11) NOT NULL,
  `profile_picture` int(11) NOT NULL,
  `is_set` tinyint(1) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent` (`parent`);

--
-- A tábla indexei `admin_rights`
--
ALTER TABLE `admin_rights`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin` (`admin`);

--
-- A tábla indexei `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_id` (`item_id`);

--
-- A tábla indexei `controls`
--
ALTER TABLE `controls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings` (`settings`);

--
-- A tábla indexei `crafting_table_slots`
--
ALTER TABLE `crafting_table_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tip` (`tip`),
  ADD KEY `status` (`status`);

--
-- A tábla indexei `difficulties`
--
ALTER TABLE `difficulties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `color_code` (`color_code`);

--
-- A tábla indexei `gamemodes`
--
ALTER TABLE `gamemodes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `difficulty` (`difficulty`);

--
-- A tábla indexei `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type` (`type`),
  ADD KEY `player` (`player`);

--
-- A tábla indexei `guess_types`
--
ALTER TABLE `guess_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- A tábla indexei `hints`
--
ALTER TABLE `hints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game` (`game`);

--
-- A tábla indexei `inventories_items`
--
ALTER TABLE `inventories_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game` (`game`),
  ADD KEY `item` (`item`);

--
-- A tábla indexei `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_id` (`item_id`);

--
-- A tábla indexei `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- A tábla indexei `profile_borders`
--
ALTER TABLE `profile_borders`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `profile_pictures`
--
ALTER TABLE `profile_pictures`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `achievement` (`achievement`),
  ADD KEY `reward_type` (`reward_type`);

--
-- A tábla indexei `reward_types`
--
ALTER TABLE `reward_types`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- A tábla indexei `table_mappings`
--
ALTER TABLE `table_mappings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `control` (`control`);

--
-- A tábla indexei `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game` (`game`);

--
-- A tábla indexei `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user` (`user`),
  ADD UNIQUE KEY `login_token` (`login_token`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `users_achievements`
--
ALTER TABLE `users_achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `achievement` (`achievement`),
  ADD KEY `user` (`user`);

--
-- A tábla indexei `users_collections`
--
ALTER TABLE `users_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `collection` (`collection`);

--
-- A tábla indexei `users_profile_borders`
--
ALTER TABLE `users_profile_borders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `profile_border` (`profile_border`);

--
-- A tábla indexei `users_profile_pictures`
--
ALTER TABLE `users_profile_pictures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `profile_picture` (`profile_picture`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT a táblához `admin_rights`
--
ALTER TABLE `admin_rights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=900;

--
-- AUTO_INCREMENT a táblához `controls`
--
ALTER TABLE `controls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `crafting_table_slots`
--
ALTER TABLE `crafting_table_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `difficulties`
--
ALTER TABLE `difficulties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `gamemodes`
--
ALTER TABLE `gamemodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `guess_types`
--
ALTER TABLE `guess_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `hints`
--
ALTER TABLE `hints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `inventories_items`
--
ALTER TABLE `inventories_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=613;

--
-- AUTO_INCREMENT a táblához `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `profile_borders`
--
ALTER TABLE `profile_borders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `profile_pictures`
--
ALTER TABLE `profile_pictures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT a táblához `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT a táblához `reward_types`
--
ALTER TABLE `reward_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `table_mappings`
--
ALTER TABLE `table_mappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tips`
--
ALTER TABLE `tips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT a táblához `users_achievements`
--
ALTER TABLE `users_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users_collections`
--
ALTER TABLE `users_collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users_profile_borders`
--
ALTER TABLE `users_profile_borders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users_profile_pictures`
--
ALTER TABLE `users_profile_pictures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `achievements` (`id`);

--
-- Megkötések a táblához `admin_rights`
--
ALTER TABLE `admin_rights`
  ADD CONSTRAINT `admin_rights_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `controls`
--
ALTER TABLE `controls`
  ADD CONSTRAINT `controls_ibfk_1` FOREIGN KEY (`settings`) REFERENCES `settings` (`id`);

--
-- Megkötések a táblához `crafting_table_slots`
--
ALTER TABLE `crafting_table_slots`
  ADD CONSTRAINT `crafting_table_slots_ibfk_1` FOREIGN KEY (`tip`) REFERENCES `tips` (`id`),
  ADD CONSTRAINT `crafting_table_slots_ibfk_2` FOREIGN KEY (`status`) REFERENCES `guess_types` (`id`);

--
-- Megkötések a táblához `gamemodes`
--
ALTER TABLE `gamemodes`
  ADD CONSTRAINT `gamemodes_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `difficulties` (`id`);

--
-- Megkötések a táblához `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`type`) REFERENCES `gamemodes` (`id`),
  ADD CONSTRAINT `games_ibfk_2` FOREIGN KEY (`player`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `hints`
--
ALTER TABLE `hints`
  ADD CONSTRAINT `hints_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games` (`id`);

--
-- Megkötések a táblához `inventories_items`
--
ALTER TABLE `inventories_items`
  ADD CONSTRAINT `inventories_items_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games` (`id`),
  ADD CONSTRAINT `inventories_items_ibfk_2` FOREIGN KEY (`item`) REFERENCES `items` (`id`);

--
-- Megkötések a táblához `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`achievement`) REFERENCES `achievements` (`id`),
  ADD CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`reward_type`) REFERENCES `reward_types` (`id`);

--
-- Megkötések a táblához `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `table_mappings`
--
ALTER TABLE `table_mappings`
  ADD CONSTRAINT `table_mappings_ibfk_1` FOREIGN KEY (`control`) REFERENCES `controls` (`id`);

--
-- Megkötések a táblához `tips`
--
ALTER TABLE `tips`
  ADD CONSTRAINT `tips_ibfk_1` FOREIGN KEY (`game`) REFERENCES `games` (`id`);

--
-- Megkötések a táblához `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `users_achievements`
--
ALTER TABLE `users_achievements`
  ADD CONSTRAINT `users_achievements_ibfk_1` FOREIGN KEY (`achievement`) REFERENCES `achievements` (`id`),
  ADD CONSTRAINT `users_achievements_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `users_collections`
--
ALTER TABLE `users_collections`
  ADD CONSTRAINT `users_collections_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_collections_ibfk_2` FOREIGN KEY (`collection`) REFERENCES `collections` (`id`);

--
-- Megkötések a táblához `users_profile_borders`
--
ALTER TABLE `users_profile_borders`
  ADD CONSTRAINT `users_profile_borders_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_profile_borders_ibfk_2` FOREIGN KEY (`profile_border`) REFERENCES `profile_borders` (`id`);

--
-- Megkötések a táblához `users_profile_pictures`
--
ALTER TABLE `users_profile_pictures`
  ADD CONSTRAINT `users_profile_pictures_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_profile_pictures_ibfk_2` FOREIGN KEY (`profile_picture`) REFERENCES `profile_pictures` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
