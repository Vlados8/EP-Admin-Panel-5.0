-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Мар 14 2026 г., 15:39
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ep_crm_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_text` varchar(255) NOT NULL,
  `next_question_id` int(11) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `next_question_id`, `order_index`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Satteldach', 2, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 1, 'Pultdach', 2, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 1, 'Flachdach', 3, 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 2, 'Ziegel', 4, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(5, 2, 'Trapezblech', 4, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(6, 3, 'Bitumen', 4, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(7, 3, 'Folie', 4, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(8, 3, 'Kies', 4, 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(9, 4, 'So schnell wie möglich', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(10, 4, 'In 3-6 Monaten', NULL, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(11, 5, 'Einfamilienhaus', 6, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(12, 5, 'Reihenhaus', 6, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(13, 5, 'Mehrfamilienhaus', 6, 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(14, 6, 'ANY', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(15, 7, 'Komplett neu', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(16, 7, 'Erweiterung', NULL, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(17, 7, 'Nur Prüfung', NULL, 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(18, 8, 'Satteldach', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(19, 8, 'Pultdach', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(20, 8, 'Flachdach', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(21, 8, 'Sonstiges', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(22, 9, 'Ziegel', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(23, 9, 'Schiefer', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(24, 9, 'Trapezblech', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(25, 9, 'Eternit', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(26, 9, 'Sonstiges', NULL, 4, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(27, 11, 'Beratung durch Experten', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(28, 11, 'Bis 5 kWp', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(29, 11, '5-10 kWp', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(30, 11, '10-15 kWp', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(31, 11, 'Über 15 kWp', NULL, 4, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(32, 12, 'Ja, bitte mit planen', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(33, 12, 'Nein, bereits vorhanden', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(34, 12, 'Nein, nicht benötigt', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(35, 13, 'Ja, bitte mit planen', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(36, 13, 'Nein, nicht benötigt', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(37, 13, 'Beratung dazu gewünscht', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(38, 14, 'Sofort', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(39, 14, 'In 3 Monaten', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(40, 14, 'In 6 Monaten+', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(41, 14, 'Noch in Planung', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(42, 15, 'Einfamilienhaus', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(43, 15, 'Reihenhaus', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(44, 15, 'Mehrfamilienhaus', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(45, 15, 'Gewerbe', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(46, 18, 'Gasheizung', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(47, 18, 'Ölheizung', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(48, 18, 'Elektroheizung', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(49, 18, 'Sonstiges', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(50, 19, 'Fußbodenheizung', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(51, 19, 'Heizkörper', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(52, 19, 'Mix (Fußboden & Heizkörper)', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(53, 20, 'Neubau / Passivhaus', NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(54, 20, 'Gut gedämmter Altbau', NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(55, 20, 'Teilsaniert', NULL, 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(56, 20, 'Ungedämmt', NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `company_id`, `name`, `description`, `icon`, `order_index`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Photovoltaik (PV)', 'Solaranlagen und Speicher', 'fa-solar-panel', 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Wärmepumpe (WP)', 'Heizsysteme und Installation', 'fa-fire-burner', 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Elektroinstallation', 'Zählerschrank, Wallbox, Smart Home', 'fa-bolt', 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Sanitär & Heizung', 'Badsanierung, Wasserrohre', 'fa-faucet-drip', 3, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(5, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Dach & Fassade', 'Dachdeckerarbeiten, Dämmung', 'fa-house', 4, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(6, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Maler & Trockenbau', 'Wände streichen, Wände ziehen', 'fa-paint-roller', 5, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(7, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Garten & Landschaftsbau', 'Pflasterarbeiten, Zäune', 'fa-leaf', 6, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(8, 'd2864863-2a38-4d58-8cf4-8f073f313e9b', 'Photovoltaik (PV)', 'Solaranlagen und Speicher', 'fa-solar-panel', 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(9, 'd2864863-2a38-4d58-8cf4-8f073f313e9b', 'Wärmepumpe (WP)', 'Effiziente Heizsysteme', 'fa-fire-burner', 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `type` enum('company','private') DEFAULT 'company',
  `status` enum('active','inactive','lead') DEFAULT 'active',
  `source` enum('funnelforms','admin_panel') DEFAULT 'funnelforms',
  `notes` text DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `clients`
--

INSERT INTO `clients` (`id`, `company_id`, `name`, `contact_person`, `email`, `phone`, `address`, `zip_code`, `city`, `type`, `status`, `source`, `notes`, `password_hash`, `is_verified`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Immobilien Meier GmbH', 'Herr Schmidt', 'info@immo-meier.de', '089 123456', 'Hauptstraße 15', '80331', 'München', 'company', 'active', 'funnelforms', 'Stammkunde seit 2020.', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Baugenossenschaft Süd', 'Frau Weber', 'bauleitung@bg-sued.de', '089 987654', 'Südpark 3', '81373', 'München', 'company', 'active', 'funnelforms', NULL, NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Privatier Wagner', 'Max Wagner', 'm.wagner@private.de', '0151 5556667', 'Villenviertel 8', '82031', 'Grünwald', 'private', 'lead', 'funnelforms', 'Interesse an Badsanierung.', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'dsfsdf fdsfdsf', NULL, 'fdff@gmail.com', '432432', NULL, NULL, NULL, 'company', 'lead', 'funnelforms', NULL, NULL, 0, '2026-03-08 12:02:25', '2026-03-08 12:02:25', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `companies`
--

CREATE TABLE `companies` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `billing_plan` enum('free','pro','enterprise') DEFAULT 'pro',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `companies`
--

INSERT INTO `companies` (`id`, `name`, `billing_plan`, `created_at`, `updated_at`, `deleted_at`) VALUES
('d2864863-2a38-4d58-8cf4-8f073f313e9b', 'EP Construction', 'pro', '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
('d3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'EP Bauunternehmen GmbH', 'enterprise', '2026-03-08 11:27:14', '2026-03-08 11:27:14', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('new','contacted','qualified','proposal','won','lost') DEFAULT 'new',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `inquiries`
--

INSERT INTO `inquiries` (`id`, `company_id`, `client_id`, `project_id`, `category_id`, `subcategory_id`, `title`, `contact_name`, `contact_email`, `contact_phone`, `location`, `status`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, 1, NULL, 'Anfrage Solaranlage Meier', 'Familie Meier', 'meier.familie@example.com', '0151 1234567', '80331 München', 'new', 'Kunde wünscht schnellen Rückruf.', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, 2, NULL, 'Neue Wärmepumpe für Altbau', 'Johannes Schmidt', 'j.schmidt@example.com', NULL, 'Außenbezirk 12', 'contacted', 'Hat bereits ein Angebot von Konkurrenz.', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, 1, NULL, 'asdsa', 'dsadas', '1111@gmai.com', '21321321', '211', 'new', 'ddddd', '2026-03-08 13:19:08', '2026-03-08 13:19:08', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `inquiry_answers`
--

CREATE TABLE `inquiry_answers` (
  `id` int(11) NOT NULL,
  `inquiry_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `answer_value` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `inquiry_answers`
--

INSERT INTO `inquiry_answers` (`id`, `inquiry_id`, `question_id`, `answer_id`, `answer_value`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 'Satteldach', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 1, 2, 4, 'Ziegel', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 2, 5, 11, 'Einfamilienhaus', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 2, 6, NULL, '140', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(5, 3, 1, 2, 'Pultdach', '2026-03-08 13:19:08', '2026-03-08 13:19:08', NULL),
(6, 3, 2, 5, 'Trapezblech', '2026-03-08 13:19:08', '2026-03-08 13:19:08', NULL),
(7, 3, 4, 10, 'In 3-6 Monaten', '2026-03-08 13:19:08', '2026-03-08 13:19:08', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL,
  `color` varchar(255) NOT NULL DEFAULT 'blue',
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `notes`
--

INSERT INTO `notes` (`id`, `title`, `content`, `date`, `color`, `project_id`, `is_done`, `created_at`, `updated_at`, `deleted_at`, `user_id`) VALUES
(1, 'Material fehlt', 'Auf Baustelle A fehlen noch 5 Sack Zement. Bitte nachliefern.', '2026-03-08', 'yellow', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 13:03:44', NULL, '2116912e-a0ab-4571-aaff-71e45325ed9f'),
(2, 'Wetterwarnung', 'Morgen starker Regen erwartet. Dacharbeiten verschieben.', '2026-03-09', 'blue', NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL, '81cb776e-4e4e-4642-a19f-2305f4d08dfd'),
(3, 'пвавпав', 'авп', '2026-03-08', 'blue', NULL, 0, '2026-03-08 12:59:30', '2026-03-08 12:59:30', NULL, '14cdf88a-c008-4b07-bd02-f8db2f2ff209');

-- --------------------------------------------------------

--
-- Структура таблицы `projects`
--

CREATE TABLE `projects` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_number` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT 0.00,
  `address` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'aktiv',
  `progress` int(11) NOT NULL DEFAULT 0,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `subcategory_id` int(11) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `projects`
--

INSERT INTO `projects` (`id`, `project_number`, `title`, `description`, `budget`, `address`, `status`, `progress`, `start_date`, `end_date`, `client_id`, `main_image`, `category_id`, `subcategory_id`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
('1e0720e1-74f4-4ebc-aa84-21e8d15cc3c1', 'EP-001', 'Sanierung Villa Schmidt', 'Komplettsanierung des Erdgeschosses inklusive Elektrik und Sanitär.', 0.00, 'Goethestraße 12, 80336 München', 'Aktiv', 35, '2026-03-08 11:27:15', NULL, 1, NULL, NULL, NULL, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('9b60ca33-546e-4477-9c7c-42c7053b34f8', 'EP-002', 'Neubau Wohnanlage Süd', 'Errichtung einer Wohnanlage mit 20 Einheiten.', 0.00, 'Sonnenallee 5, 81373 München', 'Planung', 10, '2026-04-08 11:27:15', NULL, 2, NULL, NULL, NULL, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `project_answers`
--

CREATE TABLE `project_answers` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_id` int(11) DEFAULT NULL,
  `custom_value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `project_images`
--

CREATE TABLE `project_images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `uploaded_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `project_stages`
--

CREATE TABLE `project_stages` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'In Arbeit',
  `assigned_to_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `project_stages`
--

INSERT INTO `project_stages` (`id`, `project_id`, `title`, `description`, `status`, `assigned_to_id`, `created_by_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('a0e3af11-e8d2-423f-9ebc-ef72968985bc', '1e0720e1-74f4-4ebc-aa84-21e8d15cc3c1', 'Baustelleneinrichtung', 'Aufstellen von Werkzeugen', 'Erledigt', '2116912e-a0ab-4571-aaff-71e45325ed9f', 'c54bc9c8-3607-444a-a101-4e4b1fea094d', '2026-03-08 11:27:15', '2026-03-08 13:37:29', NULL),
('cec6ada9-b9ea-4086-b3da-e215100221c5', '1e0720e1-74f4-4ebc-aa84-21e8d15cc3c1', 'Abbrucharbeiten', 'Abriss alter Wände', 'In Arbeit', '2116912e-a0ab-4571-aaff-71e45325ed9f', 'c54bc9c8-3607-444a-a101-4e4b1fea094d', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `project_stage_images`
--

CREATE TABLE `project_stage_images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_stage_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `path` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `project_subcontractors`
--

CREATE TABLE `project_subcontractors` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `subcontractor_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `project_users`
--

CREATE TABLE `project_users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role` enum('projektleiter','gruppenleiter','worker') NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `subcategory_id` int(11) NOT NULL,
  `field_key` varchar(255) DEFAULT NULL,
  `question_text` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('radio','checkbox','input','select','slider') DEFAULT 'radio',
  `unit` varchar(255) DEFAULT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `questions`
--

INSERT INTO `questions` (`id`, `subcategory_id`, `field_key`, `question_text`, `description`, `type`, `unit`, `config`, `order_index`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, NULL, 'Welche Form hat das Dach?', NULL, '', NULL, NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 1, NULL, 'Woraus besteht die Dacheindeckung?', NULL, '', NULL, NULL, 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 1, NULL, 'Welche Abdichtung hat das Flachdach?', NULL, '', NULL, NULL, 2, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 1, NULL, 'Wann soll die Installation erfolgen?', NULL, '', NULL, NULL, 3, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(5, 2, NULL, 'Art des Gebäudes?', NULL, '', NULL, NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(6, 2, NULL, 'Wie groß ist die zu beheizende Wohnfläche?', NULL, 'slider', 'm²', '{\"min\":50,\"max\":400,\"step\":10,\"default\":150}', 1, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(7, 3, NULL, 'Welche Leistung benötigen Sie für den Zählerschrank?', NULL, '', NULL, NULL, 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(8, 4, NULL, 'Welche Form hat das Dach?', NULL, 'radio', NULL, NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(9, 4, NULL, 'Woraus besteht die Dacheindeckung?', NULL, 'radio', NULL, NULL, 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(10, 4, NULL, 'Wie hoch ist Ihr jährlicher Stromverbrauch?', NULL, 'slider', 'kWh', '{\"min\":1000,\"max\":20000,\"step\":500,\"default\":4000}', 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(11, 4, NULL, 'Gewünschte PV-Leistung auf dem Dach (kWp)?', NULL, 'radio', NULL, NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(12, 4, NULL, 'Benötigen Sie eine Wallbox (Ladestation)?', NULL, 'radio', NULL, NULL, 4, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(13, 4, NULL, 'Stromspeicher (Batterie) erwünscht?', NULL, 'radio', NULL, NULL, 5, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(14, 4, NULL, 'Wann soll die Installation erfolgen?', NULL, 'radio', NULL, NULL, 6, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(15, 5, NULL, 'Art des Gebäudes?', NULL, 'radio', NULL, NULL, 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(16, 5, NULL, 'Wie groß ist die zu beheizende Wohnfläche?', NULL, 'slider', 'm²', '{\"min\":50,\"max\":500,\"step\":10,\"default\":150}', 1, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(17, 5, NULL, 'Voraussichtlicher Energiebedarf pro Jahr?', NULL, 'slider', 'kWh', '{\"min\":5000,\"max\":50000,\"step\":1000,\"default\":20000}', 2, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(18, 5, NULL, 'Was ist Ihre aktuelle Heizungsart?', NULL, 'radio', NULL, NULL, 3, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(19, 5, NULL, 'Wie erfolgt die Wärmeabgabe im Haus?', NULL, 'radio', NULL, NULL, 4, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(20, 5, NULL, 'Gebäude-Zustand / Dämmung?', NULL, 'radio', NULL, NULL, 5, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
('553f8af5-343a-47ba-8a76-607920b82f22', 'Worker'),
('63248e95-29fa-4013-bb9a-dfc69bafacdf', 'Projektleiter'),
('6a3fbaab-00f2-45a6-adf2-cf3971326c1b', 'Gruppenleiter'),
('973951b5-4c46-4158-87ff-5fb4fd1395e9', 'Büro'),
('bae232e4-ce61-45cc-beec-918c7a987530', 'Admin');

-- --------------------------------------------------------

--
-- Структура таблицы `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `subcategories`
--

INSERT INTO `subcategories` (`id`, `category_id`, `name`, `description`, `order_index`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'PV Planung & Dach', 'Dachdetails klären', 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 2, 'WP Gebäudeangaben', 'Haus details', 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 3, 'Zählerschrank / Hauptverteilung', 'Erneuerung Zähleranlagen', 0, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(4, 8, 'PV Konfiguration', 'Dachdetails & Planung', 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL),
(5, 9, 'WP Konfiguration', 'Haus details & Planung', 0, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `subcontractors`
--

CREATE TABLE `subcontractors` (
  `id` int(11) NOT NULL,
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `trade` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `subcontractors`
--

INSERT INTO `subcontractors` (`id`, `company_id`, `name`, `trade`, `contact_person`, `email`, `phone`, `address`, `zip_code`, `city`, `hourly_rate`, `status`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Müller Elektrotechnik', 'Elektriker', 'Hans Müller', 'info@mueller-elektro.de', '0170 1234567', 'Stromweg 1', '80331', 'München', 65.00, 'active', 'Zuverlässig für Großprojekte.', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Schmidt Sanitäranlagen', 'Sanitär', 'Peter Schmidt', 'kontakt@schmidt-sanitaer.de', '0172 9876543', 'Wasserstraße 5', '80469', 'München', 70.00, 'active', NULL, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(3, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'Dachdecker Profis GmbH', 'Dachdecker', NULL, NULL, NULL, NULL, NULL, NULL, 55.00, 'inactive', NULL, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `support_responses`
--

CREATE TABLE `support_responses` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `response_type` enum('note','email','phone') NOT NULL DEFAULT 'note',
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `support_responses`
--

INSERT INTO `support_responses` (`id`, `ticket_id`, `user_id`, `response_type`, `message`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'Team Sanitär ist informiert und wird in den nächsten 2 Stunden anrufen.', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 1, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'email', 'Hallo Familie Schmidt, wir haben das Ticket erhalten. Unser Sanitär-Team (Wasser & Sanitär AG) ist informiert und wird sich in den nächsten 2 Stunden bei Ihnen melden.', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(10, 2, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'авыавы', '2026-03-08 11:41:20', '2026-03-08 11:41:20', NULL),
(11, 2, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'авыа', '2026-03-08 11:41:22', '2026-03-08 11:41:22', NULL),
(12, 2, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'email', 'выаыва', '2026-03-08 11:41:26', '2026-03-08 11:41:26', NULL),
(13, 2, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'phone', 'выавыавы', '2026-03-08 11:41:33', '2026-03-08 11:41:33', NULL),
(14, 1, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'phone', 'выфвыф', '2026-03-08 11:43:54', '2026-03-08 11:43:54', NULL),
(15, 1, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'ююю', '2026-03-08 11:45:45', '2026-03-08 11:45:45', NULL),
(16, 3, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'ffdfs', '2026-03-08 11:55:27', '2026-03-08 11:55:27', NULL),
(17, 4, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'dsfs', '2026-03-08 11:58:21', '2026-03-08 11:58:21', NULL),
(18, 6, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'note', 'fdsfds', '2026-03-08 12:17:05', '2026-03-08 12:17:05', NULL),
(19, 6, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'email', 'dsfs', '2026-03-08 12:17:08', '2026-03-08 12:17:08', NULL),
(20, 6, 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'phone', 'dfsdf', '2026-03-08 12:17:10', '2026-03-08 12:17:10', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `assigned_to_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('new','open','in_progress','resolved','closed') DEFAULT 'new',
  `priority` enum('low','normal','high','urgent') DEFAULT 'normal',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `client_email` varchar(255) DEFAULT NULL,
  `client_phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `company_id`, `client_id`, `project_id`, `assigned_to_id`, `subject`, `description`, `status`, `priority`, `created_at`, `updated_at`, `deleted_at`, `client_name`, `client_email`, `client_phone`) VALUES
(1, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 1, '1e0720e1-74f4-4ebc-aa84-21e8d15cc3c1', 'c54bc9c8-3607-444a-a101-4e4b1fea094d', 'Wasserschaden Keller', 'Wir haben heute Morgen festgestellt, dass im Keller Wasser steht. Es scheint aus der Wand im Heizungskeller zu kommen. Bitte dringend prüfen!', 'open', 'urgent', '2026-03-08 11:27:15', '2026-03-08 11:54:21', NULL, NULL, NULL, NULL),
(2, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 2, '9b60ca33-546e-4477-9c7c-42c7053b34f8', '2116912e-a0ab-4571-aaff-71e45325ed9f', 'Fenster klemmt', 'Das Fenster im Erdgeschoss Wohnzimmer lässt sich nicht mehr richtig schließen.', 'new', 'normal', '2026-03-08 11:27:15', '2026-03-08 11:54:42', NULL, NULL, NULL, NULL),
(3, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, NULL, 'dsafsdafdsfsd', 'dsfsdfdsfsdfd fdssdsfdsfds fdsfds fdsf dfds fds', 'open', 'urgent', '2026-03-08 11:55:17', '2026-03-08 11:55:29', NULL, NULL, NULL, NULL),
(4, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, NULL, 'ds fds', 'fds fds f', 'new', 'normal', '2026-03-08 11:55:32', '2026-03-08 11:55:32', NULL, NULL, NULL, NULL),
(5, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 4, NULL, NULL, 'sdfsd', 'dsfdsfsd', 'new', 'normal', '2026-03-08 12:02:25', '2026-03-08 12:02:25', NULL, NULL, NULL, NULL),
(6, 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', NULL, NULL, NULL, 'safsdfsdf sdfds f', 'dsf sdfsd fds fds ', 'closed', 'normal', '2026-03-08 12:16:33', '2026-03-08 12:17:18', NULL, 'вввв ааааа', 'sssss@gmail.com', '123455555');

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('In Arbeit','Erledigt','Warten') DEFAULT 'In Arbeit',
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `assigned_to_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `project_id`, `due_date`, `assigned_to_id`, `created_by_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Fundament gießen', 'Auf Baustelle Villa Schmidt das Fundament gießen laut Plan.', 'In Arbeit', NULL, NULL, '8be3daae-8075-41bc-ac91-62631972f3d0', '2116912e-a0ab-4571-aaff-71e45325ed9f', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
(2, 'Elektroinstallation prüfen', 'Prüfen der Installationen im Südkomplex vor der Abnahme.', 'Erledigt', NULL, NULL, '2116912e-a0ab-4571-aaff-71e45325ed9f', '81cb776e-4e4e-4642-a19f-2305f4d08dfd', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `task_images`
--

CREATE TABLE `task_images` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `path` varchar(255) NOT NULL,
  `task_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `company_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `manager_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `specialty`, `password_hash`, `status`, `company_id`, `role_id`, `manager_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('14cdf88a-c008-4b07-bd02-f8db2f2ff209', 'Lukas Worker', 'lukas.w@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'inactive', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '553f8af5-343a-47ba-8a76-607920b82f22', 'afda48fe-a547-4a6b-abcf-09358edf8476', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('2116912e-a0ab-4571-aaff-71e45325ed9f', 'Thomas Gruppenleiter1', 'thomas.gl@ep-bau.de', '', '', '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '6a3fbaab-00f2-45a6-adf2-cf3971326c1b', '81cb776e-4e4e-4642-a19f-2305f4d08dfd', '2026-03-08 11:27:15', '2026-03-08 13:42:25', NULL),
('54bdd4c4-8156-48e8-8834-c5c92d1775b5', 'Sabine (Büro)', 'buero@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '973951b5-4c46-4158-87ff-5fb4fd1395e9', NULL, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('81cb776e-4e4e-4642-a19f-2305f4d08dfd', 'Klaus Projektleiter', 'klaus.pl@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '63248e95-29fa-4013-bb9a-dfc69bafacdf', 'c54bc9c8-3607-444a-a101-4e4b1fea094d', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('8be3daae-8075-41bc-ac91-62631972f3d0', 'Jan Worker', 'jan.w@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '553f8af5-343a-47ba-8a76-607920b82f22', '2116912e-a0ab-4571-aaff-71e45325ed9f', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('a0e2032f-eab0-4741-ac88-a02e77948335', 'Peter Worker', 'peter.w@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '553f8af5-343a-47ba-8a76-607920b82f22', '2116912e-a0ab-4571-aaff-71e45325ed9f', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('afda48fe-a547-4a6b-abcf-09358edf8476', 'Markus Gruppenleiter', 'markus.gl@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', '6a3fbaab-00f2-45a6-adf2-cf3971326c1b', '81cb776e-4e4e-4642-a19f-2305f4d08dfd', '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('c54bc9c8-3607-444a-a101-4e4b1fea094d', 'System Admin', 'admin@ep-bau.de', NULL, NULL, '$2b$10$zHVmowA7xTrlsKTHcbER3.FsyI9RkXBUcXg1gd5RgnyvwY5AsjigC', 'active', 'd3ba48fd-35d4-466d-93c2-5b23ff3fcc44', 'bae232e4-ce61-45cc-beec-918c7a987530', NULL, '2026-03-08 11:27:15', '2026-03-08 11:27:15', NULL),
('f6a8d0aa-d526-40db-8751-f81162437d23', 'System Admin', 'admin@example.com', NULL, NULL, '$2b$12$QVdkk11hLWNyMyTHHDjbqe7zkrP.M./vk5XYOXDtAptfj.68P/PgO', 'active', 'd2864863-2a38-4d58-8cf4-8f073f313e9b', 'bae232e4-ce61-45cc-beec-918c7a987530', NULL, '2026-03-08 18:16:56', '2026-03-08 18:16:56', NULL);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `next_question_id` (`next_question_id`);

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Индексы таблицы `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Индексы таблицы `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`);

--
-- Индексы таблицы `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

--
-- Индексы таблицы `inquiry_answers`
--
ALTER TABLE `inquiry_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inquiry_id` (`inquiry_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- Индексы таблицы `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_number` (`project_number`),
  ADD UNIQUE KEY `project_number_2` (`project_number`),
  ADD UNIQUE KEY `project_number_3` (`project_number`),
  ADD UNIQUE KEY `project_number_4` (`project_number`),
  ADD UNIQUE KEY `project_number_5` (`project_number`),
  ADD UNIQUE KEY `project_number_6` (`project_number`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `subcategory_id` (`subcategory_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Индексы таблицы `project_answers`
--
ALTER TABLE `project_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `answer_id` (`answer_id`);

--
-- Индексы таблицы `project_images`
--
ALTER TABLE `project_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Индексы таблицы `project_stages`
--
ALTER TABLE `project_stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to_id` (`assigned_to_id`),
  ADD KEY `created_by_id` (`created_by_id`);

--
-- Индексы таблицы `project_stage_images`
--
ALTER TABLE `project_stage_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_stage_id` (`project_stage_id`);

--
-- Индексы таблицы `project_subcontractors`
--
ALTER TABLE `project_subcontractors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `subcontractor_id` (`subcontractor_id`);

--
-- Индексы таблицы `project_users`
--
ALTER TABLE `project_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Индексы таблицы `subcontractors`
--
ALTER TABLE `subcontractors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Индексы таблицы `support_responses`
--
ALTER TABLE `support_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to_id` (`assigned_to_id`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to_id` (`assigned_to_id`),
  ADD KEY `created_by_id` (`created_by_id`);

--
-- Индексы таблицы `task_images`
--
ALTER TABLE `task_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `inquiry_answers`
--
ALTER TABLE `inquiry_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `subcontractors`
--
ALTER TABLE `subcontractors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `support_responses`
--
ALTER TABLE `support_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`next_question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_ibfk_26` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_27` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_28` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_29` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_30` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `inquiry_answers`
--
ALTER TABLE `inquiry_answers`
  ADD CONSTRAINT `inquiry_answers_ibfk_16` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiry_answers_ibfk_17` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiry_answers_ibfk_18` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_11` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_21` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_22` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_23` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_24` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_answers`
--
ALTER TABLE `project_answers`
  ADD CONSTRAINT `project_answers_ibfk_16` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_answers_ibfk_17` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_answers_ibfk_18` FOREIGN KEY (`answer_id`) REFERENCES `answers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_images`
--
ALTER TABLE `project_images`
  ADD CONSTRAINT `project_images_ibfk_11` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_images_ibfk_12` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_stages`
--
ALTER TABLE `project_stages`
  ADD CONSTRAINT `project_stages_ibfk_16` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_stages_ibfk_17` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_stages_ibfk_18` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_stage_images`
--
ALTER TABLE `project_stage_images`
  ADD CONSTRAINT `project_stage_images_ibfk_1` FOREIGN KEY (`project_stage_id`) REFERENCES `project_stages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_subcontractors`
--
ALTER TABLE `project_subcontractors`
  ADD CONSTRAINT `project_subcontractors_ibfk_11` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_subcontractors_ibfk_12` FOREIGN KEY (`subcontractor_id`) REFERENCES `subcontractors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `project_users`
--
ALTER TABLE `project_users`
  ADD CONSTRAINT `project_users_ibfk_11` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_users_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `subcontractors`
--
ALTER TABLE `subcontractors`
  ADD CONSTRAINT `subcontractors_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `support_responses`
--
ALTER TABLE `support_responses`
  ADD CONSTRAINT `support_responses_ibfk_11` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `support_responses_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_21` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `support_tickets_ibfk_22` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `support_tickets_ibfk_23` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `support_tickets_ibfk_24` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_16` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_17` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_18` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `task_images`
--
ALTER TABLE `task_images`
  ADD CONSTRAINT `task_images_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_16` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_17` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_18` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
