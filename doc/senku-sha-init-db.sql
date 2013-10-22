/****************************************************/
/* SQL Queries to create the database for Senku-Sha */
/****************************************************/


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

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

DROP DATABASE IF EXISTS `senku-sha`;
CREATE DATABASE `senku-sha` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_520_ci;
USE `senku-sha`;

-- --------------------------------------------------------

--
-- Table `users`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_LEVEL_NAME` (`name`),
  UNIQUE KEY `UNIQUE_EMAIL` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=2 ;

--
-- Table `levels`
--

CREATE TABLE IF NOT EXISTS `level` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `data` text COLLATE utf8_unicode_520_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL DEFAULT '',
  `creator` int(32) NOT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_USER_TITLE` (`title`),
  FOREIGN KEY `FK_LEVEL_CREATOR_USER_ID` (`creator`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=1 ;

--
-- Table `hiscore`
--

CREATE TABLE IF NOT EXISTS `hiscore` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `time` int(32) NOT NULL,
  `user` int(32) NOT NULL,
  `level` int(32) NOT NULL,
  `date` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY `FK_HISCORE_USER_USER_ID` (`user`) REFERENCES `user` (`id`)
  FOREIGN KEY `FK_HISCORE_LEVEL_LEVEL_ID` (`level`) REFERENCES `level` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=1 ;


--
-- Give rights to user for database
--

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, FILE, EXECUTE, CREATE VIEW, SHOW VIEW, EVENT, TRIGGER ON *.* TO 'senku-sha'@'localhost' IDENTIFIED BY PASSWORD '*7AE7A04B5497E3F7A078E67D591A87DDE8540E96' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON `senku-sha\_%`.* TO 'senku-sha'@'localhost';

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;