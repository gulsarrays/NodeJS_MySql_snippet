-- 
-- Table structure for `events`
-- 
CREATE TABLE IF NOT EXISTS `events` (
  `id` BIGINT(15) NOT NULL,
  `type` varchar(200) NOT NULL,
  `actor` BIGINT(15) NOT NULL DEFAULT '1',
  `repo` BIGINT(15) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
ALTER TABLE `events` ADD PRIMARY KEY (`id`);
ALTER TABLE `events` MODIFY `id` BIGINT(15) NOT NULL AUTO_INCREMENT;


-- 
-- Table structure for `actors`
-- 
CREATE TABLE IF NOT EXISTS `actors` (
  `id` BIGINT(15) NOT NULL,
  `login` varchar(200) NOT NULL,
  `avatar_url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
ALTER TABLE `actors` ADD PRIMARY KEY (`id`);
ALTER TABLE `actors` MODIFY `id` BIGINT(15) NOT NULL AUTO_INCREMENT;


-- 
-- Table structure for `repos`
-- 
CREATE TABLE IF NOT EXISTS `repos` (
  `id` BIGINT(15) NOT NULL,
  `name` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 
ALTER TABLE `repos` ADD PRIMARY KEY (`id`);
ALTER TABLE `repos` MODIFY `id` BIGINT(15) NOT NULL AUTO_INCREMENT;