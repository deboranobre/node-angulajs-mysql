SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `passei_direto`
--

CREATE DATABASE IF NOT EXISTS `passei_direto` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `passei_direto`;

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE IF NOT EXISTS `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` text NOT NULL
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Table structure for table `records`
--

CREATE TABLE IF NOT EXISTS `records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(512) NOT NULL,
  `artist` varchar(512) NOT NULL,
  `year` int(4) NOT NULL,
  `collection_id` int(4) NOT NULL,
  INDEX collection_id (collection_id),
    FOREIGN KEY (collection_id)
        REFERENCES collections(id)
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

