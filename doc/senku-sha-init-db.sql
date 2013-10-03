SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Create database user
--

USE `mysql`;

DELETE FROM `user` WHERE `User` = 'senku-sha';

INSERT INTO `user` (`Host`, `User`, `Password`)
VALUES ('localhost', 'senku-sha', PASSWORD('53nku-5h4'));

--
-- Database: `senku-sha`
--

CREATE DATABASE IF NOT EXISTS `senku-sha` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_520_ci;
USE `senku-sha`;

-- --------------------------------------------------------

--
-- Table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=2 ;

--
-- Give rights to user for database
--

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, FILE, EXECUTE, CREATE VIEW, SHOW VIEW, EVENT, TRIGGER ON *.* TO 'senku-sha'@'localhost' IDENTIFIED BY PASSWORD '*7AE7A04B5497E3F7A078E67D591A87DDE8540E96' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON `senku-sha\_%`.* TO 'senku-sha'@'localhost';