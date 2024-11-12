-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 12. 14:30
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

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
  `parent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin_rights`
--

CREATE TABLE `admin_rights` (
  `admin` int(11) NOT NULL,
  `is_super` tinyint(1) NOT NULL,
  `delete_users` tinyint(1) NOT NULL
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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `controls`
--

CREATE TABLE `controls` (
  `id` int(11) NOT NULL,
  `settings` int(11) NOT NULL,
  `is_tap_mode` tinyint(1) NOT NULL,
  `copy` varchar(3) NOT NULL,
  `remove` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `crafting_table_slots`
--

CREATE TABLE `crafting_table_slots` (
  `tip` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
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
(1, 'treasure_map.png', 'Tutorial', "In this mode, players can learn the game\'s mechanics and controls.", 1),
(2, 'crafting_table_top.png', 'Classic', 'In this mode, you receive recipes as riddles, but only those that are not made by one type of material. Four different hints are available to help you solve them.', 3),
(3, 'clock.png', 'Daily', 'Similar to Classic, but can only be played once per day. Keep your streak going!', 3),
(4, 'compass.png', 'All in One', 'In this mode, you can receive any recipe as a riddle. Four different hints are available to help you solve it.', 4),
(5, 'bundle.png', 'Pocket', 'Similar to All in One, but you must work with a 2x2 crafting table to solve the riddles.', 3),
(6, 'chest_front.png', 'Resource', 'Similar to Classic, but with a limited supply of materials.', 2),
(7, 'raid_icon.png', 'Hardcore', 'Similar to Classic, but no hints are available, and the game is played with health points.', 5);

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `hints`
--

CREATE TABLE `hints` (
  `game` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `content` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `inventories_items`
--

CREATE TABLE `inventories_items` (
  `game` int(11) NOT NULL,
  `item` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `item_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `profile_pictures`
--

CREATE TABLE `profile_pictures` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `src` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rewards`
--

CREATE TABLE `rewards` (
  `achievement` int(11) NOT NULL,
  `reward` int(11) NOT NULL,
  `reward_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reward_types`
--

CREATE TABLE `reward_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `volume` int(11) NOT NULL,
  `image_size` int(11) NOT NULL,
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
  `is_expire` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_guest` tinyint(1) NOT NULL,
  `socket_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_achievements`
--

CREATE TABLE `users_achievements` (
  `user` int(11) NOT NULL,
  `achievement` int(11) NOT NULL,
  `progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_collections`
--

CREATE TABLE `users_collections` (
  `user` int(11) NOT NULL,
  `collection` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_profile_borders`
--

CREATE TABLE `users_profile_borders` (
  `user` int(11) NOT NULL,
  `profile_border` int(11) NOT NULL,
  `is_set` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users_profile_pictures`
--

CREATE TABLE `users_profile_pictures` (
  `user` int(11) NOT NULL,
  `profile_picture` int(11) NOT NULL,
  `is_set` tinyint(1) NOT NULL
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
  ADD KEY `game` (`game`);

--
-- A tábla indexei `inventories_items`
--
ALTER TABLE `inventories_items`
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
  ADD KEY `achievement` (`achievement`),
  ADD KEY `user` (`user`);

--
-- A tábla indexei `users_collections`
--
ALTER TABLE `users_collections`
  ADD KEY `user` (`user`),
  ADD KEY `collection` (`collection`);

--
-- A tábla indexei `users_profile_borders`
--
ALTER TABLE `users_profile_borders`
  ADD KEY `user` (`user`),
  ADD KEY `profile_border` (`profile_border`);

--
-- A tábla indexei `users_profile_pictures`
--
ALTER TABLE `users_profile_pictures`
  ADD KEY `user` (`user`),
  ADD KEY `profile_picture` (`profile_picture`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `controls`
--
ALTER TABLE `controls`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `profile_borders`
--
ALTER TABLE `profile_borders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `profile_pictures`
--
ALTER TABLE `profile_pictures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `reward_types`
--
ALTER TABLE `reward_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
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
