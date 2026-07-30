-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 29, 2026 at 02:39 PM
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
-- Database: `product_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Admin', 'admin@gmail.com', '1234', '2026-06-19 12:24:04');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(1, 10, 9, 1),
(2, 3, 8, 1),
(3, 3, 10, 1),
(4, 11, 6, 1),
(10, 14, 11, 1),
(11, 14, 9, 1),
(25, 15, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Aditya', 'aditya@gmail.com', '1234', '2026-06-19 12:26:29'),
(2, 'Dev', 'dev@gmail.com', '1234', '2026-06-19 12:27:21'),
(3, 'Raj', 'raj@gmail.com', '1234', '2026-06-19 12:28:26'),
(10, 'Dhaval', 'dhaval@gmail.com', '1234', '2026-06-25 13:57:21'),
(11, 'Darshan', 'darshan@gmail.com', '1234', '2026-06-26 09:21:25'),
(14, 'Yash', 'yash@gmail.com', '1234', '2026-06-29 13:59:50'),
(15, 'Aditya', 'adityasinhbarad@gmail.com', '1234', '2026-07-20 11:01:48');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('Pending','Confirmed','Delivered') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `quantity`, `total_price`, `status`, `created_at`) VALUES
(1, 2, 8, 1, 899.00, 'Delivered', '2026-07-07 12:24:34'),
(2, 2, 11, 1, 849.00, 'Delivered', '2026-07-07 12:24:34'),
(3, 2, 9, 1, 89999.00, 'Confirmed', '2026-07-08 06:18:51'),
(4, 2, 8, 1, 899.00, 'Delivered', '2026-07-08 06:20:31'),
(5, 2, 2, 1, 145000.00, 'Confirmed', '2026-07-08 06:55:51'),
(6, 2, 10, 1, 126999.00, 'Delivered', '2026-07-08 12:56:06'),
(9, 2, 6, 1, 535.00, 'Confirmed', '2026-07-16 12:21:55'),
(10, 2, 5, 1, 55999.00, 'Delivered', '2026-07-16 12:56:25'),
(11, 2, 13, 1, 4499.00, 'Confirmed', '2026-07-17 10:33:53'),
(12, 2, 8, 1, 899.00, 'Delivered', '2026-07-17 12:30:35'),
(13, 2, 12, 1, 61999.00, 'Confirmed', '2026-07-17 12:39:00'),
(14, 15, 7, 1, 51999.00, 'Confirmed', '2026-07-20 11:02:30'),
(15, 15, 11, 1, 849.00, 'Confirmed', '2026-07-20 13:02:48'),
(16, 15, 6, 1, 535.00, 'Delivered', '2026-07-20 13:08:00'),
(17, 15, 8, 1, 899.00, 'Confirmed', '2026-07-20 13:17:27'),
(18, 15, 5, 1, 55999.00, 'Delivered', '2026-07-20 13:26:16'),
(19, 15, 12, 1, 61999.00, 'Delivered', '2026-07-20 13:43:31'),
(20, 15, 9, 1, 89999.00, 'Confirmed', '2026-07-20 14:05:24'),
(21, 15, 11, 1, 849.00, 'Confirmed', '2026-07-22 11:59:45'),
(22, 15, 12, 1, 61999.00, 'Confirmed', '2026-07-23 05:56:49'),
(23, 15, 13, 1, 4499.00, 'Pending', '2026-07-23 05:56:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(255) NOT NULL,
  `details` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(100) DEFAULT 'Uncategorized'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `details`, `image`, `created_at`, `updated_at`, `category`) VALUES
(1, 'I Phone 17', 82000, '256GB ROM', '1781780350947.jpg', '2026-06-18 10:59:10', '2026-06-22 11:22:35', 'Mobile'),
(2, 'I Phone 17 Pro Max', 145000, '512GB ROM', '1782122271075-iphone 17 promax.jpg', '2026-06-18 11:05:17', '2026-06-22 11:22:30', 'Mobile'),
(4, 'Oneplus 13s', 57999, '12GB RAM + 256GB ROM', '1782122135469-oneplus 13s.jpg', '2026-06-18 13:27:16', '2026-06-22 12:30:03', 'Mobile'),
(5, 'Oneplus 15r', 55999, '12GB RAM + 256GB ROM', 'ff5306867709a0ad2cffb1b17ddb3716', '2026-06-19 09:21:56', '2026-06-22 12:29:53', 'Mobile'),
(6, 'Zebronics Mouse', 535, 'Wireless Mouse', '1782127172537-zebronics mouse.jpg', '2026-06-22 11:19:32', '2026-06-22 11:21:10', 'Mouse'),
(7, 'HP Laptop', 51999, 'Ryzen 5 ', '1782127801160-hp laptop.jpg', '2026-06-22 11:30:01', '2026-06-22 12:29:40', 'Laptop'),
(8, 'Petronics Keyboard', 899, 'RGB Keyboard', '1782130489659-petronics keyboard.jpg', '2026-06-22 12:13:46', '2026-06-22 12:14:49', 'Keyboard'),
(9, 'Mackbook Air M2', 89999, '8/256 GB', '1782210315354-mackbook air.jpg', '2026-06-23 10:25:15', '2026-06-23 10:25:15', 'Laptop'),
(10, 'I Pad Pro ', 126999, '5th Genration', '1782210470165-ipad pro.jpg', '2026-06-23 10:27:50', '2026-06-23 10:28:04', 'Tablet'),
(11, 'Ant Gaming Mouse', 849, 'RGB Lighting', '1782725945708-gaming mouse.jpg', '2026-06-29 09:39:05', '2026-06-29 09:39:48', 'Mouse'),
(12, 'Oneplus Tablet', 61999, 'Pad 4', '1782726117007-oneplus tab.jpg', '2026-06-29 09:41:57', '2026-06-29 09:41:57', 'Tablet'),
(13, 'Logitech Keyboard', 4499, 'Mechenical Keyboard', '1783675821855-Mechenical Keyboard.jpg', '2026-07-10 09:29:42', '2026-07-10 09:36:28', 'Keyboard');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
