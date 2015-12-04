--
-- Structure de la table `tab_events_location`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_events_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(500) NOT NULL,
  `label` varchar(500) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `tab_events_location`
--

INSERT INTO `@prefix@tab_events_location` (`id`, `code`, `label`) VALUES
  (1, 'office', 'activity.location-office'),
  (2, 'client', 'activity.location-client');

ALTER TABLE `@prefix@tab_events` ADD `locationId` INT(11) NULL AFTER `billable`;

ALTER TABLE `@prefix@tab_events` ADD INDEX(`locationId`);

ALTER TABLE `@prefix@tab_events` ADD CONSTRAINT `fk_locationId` FOREIGN KEY (`locationId`) REFERENCES `@prefix@tab_events_location`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;