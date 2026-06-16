-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2026 at 09:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamezone_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `publisher` varchar(100) NOT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `has_server` tinyint(1) DEFAULT 0,
  `server_placeholder` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `name`, `publisher`, `badge`, `image`, `description`, `has_server`, `server_placeholder`, `created_at`) VALUES
('ff', 'Free Fire', 'Garena', 'PROMO', 'images/ff_banner.jpg', 'Free Fire adalah game survival shooter berdurasi 10 menit yang menempatkanmu di pulau terpencil bertarung melawan 49 pemain lain demi menjadi yang terakhir bertahan hidup.', 0, NULL, '2026-06-16 07:05:44'),
('mlbb', 'Mobile Legends: Bang Bang', 'Moonton', 'POPULER', 'images/mlbb_banner.jpg', 'Mobile Legends: Bang Bang adalah game arena pertempuran daring multipemain (MOBA) seluler yang dikembangkan oleh Moonton. Pilih hero favoritmu dan bertarunglah bersama tim menuju kemenangan!', 1, 'Zona ID (e.g. 2004)', '2026-06-16 07:05:44'),
('pubg', 'PUBG Mobile', 'Tencent Games', 'BESTSELLER', 'images/pubg_banner.jpg', 'PUBG Mobile adalah game battle royale seluler teratas. Kuasai medan tempur, looting senjata terbaik, bertahan di zona aman, dan dapatkan Chicken Dinner bersama squad-mu!', 0, NULL, '2026-06-16 07:05:44'),
('roblox', 'Roblox', 'Roblox Corporation', 'REKOMENDASI', 'images/roblox_banner.jpg', 'Roblox adalah platform permainan daring dan sistem pembuatan permainan yang memungkinkan pengguna memprogram permainan dan memainkan permainan yang dibuat oleh pengguna lain. Top up Robux instan untuk dapatkan item game terkeren!', 0, NULL, '2026-06-16 07:05:44');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` varchar(50) NOT NULL,
  `game_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `formatted_price` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `game_id`, `name`, `price`, `formatted_price`, `created_at`) VALUES
('ff_140', 'ff', '140 Diamonds', 20000, 'Rp 20.000', '2026-06-16 07:05:44'),
('ff_1440', 'ff', '1440 Diamonds', 200000, 'Rp 200.000', '2026-06-16 07:05:44'),
('ff_355', 'ff', '355 Diamonds', 50000, 'Rp 50.000', '2026-06-16 07:05:44'),
('ff_50', 'ff', '50 Diamonds', 8000, 'Rp 8.000', '2026-06-16 07:05:44'),
('ff_720', 'ff', '720 Diamonds', 100000, 'Rp 100.000', '2026-06-16 07:05:44'),
('ff_7290', 'ff', '7290 Diamonds', 1000000, 'Rp 1.000.000', '2026-06-16 07:05:44'),
('ml_1412', 'mlbb', '1412 Diamonds', 320000, 'Rp 320.000', '2026-06-16 07:05:44'),
('ml_172', 'mlbb', '172 Diamonds', 40000, 'Rp 40.000', '2026-06-16 07:05:44'),
('ml_2195', 'mlbb', '2195 Diamonds', 490000, 'Rp 490.000', '2026-06-16 07:05:44'),
('ml_257', 'mlbb', '257 Diamonds', 60000, 'Rp 60.000', '2026-06-16 07:05:44'),
('ml_706', 'mlbb', '706 Diamonds', 160000, 'Rp 160.000', '2026-06-16 07:05:44'),
('ml_86', 'mlbb', '86 Diamonds', 20000, 'Rp 20.000', '2026-06-16 07:05:44'),
('pubg_1800', 'pubg', '1800 Unknown Cash (UC)', 370000, 'Rp 370.000', '2026-06-16 07:05:44'),
('pubg_325', 'pubg', '325 Unknown Cash (UC)', 75000, 'Rp 75.000', '2026-06-16 07:05:44'),
('pubg_3850', 'pubg', '3850 Unknown Cash (UC)', 730000, 'Rp 730.000', '2026-06-16 07:05:44'),
('pubg_60', 'pubg', '60 Unknown Cash (UC)', 15000, 'Rp 15.000', '2026-06-16 07:05:44'),
('pubg_660', 'pubg', '660 Unknown Cash (UC)', 145000, 'Rp 145.000', '2026-06-16 07:05:44'),
('pubg_8100', 'pubg', '8100 Unknown Cash (UC)', 1450000, 'Rp 1.450.000', '2026-06-16 07:05:44'),
('rob_10000', 'roblox', '10000 Robux', 1500000, 'Rp 1.500.000', '2026-06-16 07:05:44'),
('rob_1700', 'roblox', '1700 Robux', 300000, 'Rp 300.000', '2026-06-16 07:05:44'),
('rob_400', 'roblox', '400 Robux', 75000, 'Rp 75.000', '2026-06-16 07:05:44'),
('rob_4500', 'roblox', '4500 Robux', 750000, 'Rp 750.000', '2026-06-16 07:05:44'),
('rob_80', 'roblox', '80 Robux', 15000, 'Rp 15.000', '2026-06-16 07:05:44'),
('rob_800', 'roblox', '800 Robux', 145000, 'Rp 145.000', '2026-06-16 07:05:44');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `game_id` varchar(50) NOT NULL,
  `package_id` varchar(50) NOT NULL,
  `user_game_id` varchar(100) NOT NULL,
  `server_id` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `formatted_price` varchar(50) NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'SUCCESS',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin GameZone', 'admin@gamezone.com', 'admin123', 'admin', '2026-06-16 07:00:00'),
(2, 'User GameZone', 'user@gamezone.com', 'user123', 'user', '2026-06-16 07:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_packages_game_id` (`game_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_transactions_game_id` (`game_id`),
  ADD KEY `fk_transactions_package_id` (`package_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `fk_packages_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transactions_package_id` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
