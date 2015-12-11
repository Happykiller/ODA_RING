SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------

--
-- Structure de la table `tab_accounts_items_status`
--

DROP TABLE IF EXISTS `@prefix@tab_accounts_items_status`;
CREATE TABLE IF NOT EXISTS `@prefix@tab_accounts_items_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Contenu de la table `tab_accounts_items_status`
--

INSERT INTO `@prefix@tab_accounts_items_status` (`id`, `label`, `active`) VALUES
  (1, 'account.item-status-default', 1);

-- --------------------------------------------------------

--
-- Structure de la table `tab_accounts_status`
--

DROP TABLE IF EXISTS `@prefix@tab_accounts_status`;
CREATE TABLE IF NOT EXISTS `@prefix@tab_accounts_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Contenu de la table `tab_accounts_status`
--

INSERT INTO `@prefix@tab_accounts_status` (`id`, `label`, `active`) VALUES
  (1, 'account.status-default', 1);

-- --------------------------------------------------------

--
-- Structure de la table `tab_accounts`
--

DROP TABLE IF EXISTS `@prefix@tab_accounts`;
CREATE TABLE IF NOT EXISTS `@prefix@tab_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `salesForce` varchar(500) NOT NULL,
  `statusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statusId` (`statusId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Contenu de la table `tab_accounts`
--

INSERT INTO `@prefix@tab_accounts` (`id`, `code`, `label`, `salesForce`, `statusId`) VALUES
  (1, 'default', 'account.default', '', 1);

-- --------------------------------------------------------

--
-- Structure de la table `tab_accounts_items`
--

DROP TABLE IF EXISTS `@prefix@tab_accounts_items`;
CREATE TABLE IF NOT EXISTS `@prefix@tab_accounts_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `salesForce` varchar(500) NOT NULL,
  `accountId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `charge` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `accountId` (`accountId`),
  KEY `statusId` (`statusId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Contenu de la table `tab_accounts_items`
--

INSERT INTO `@prefix@tab_accounts_items` (`id`, `code`, `label`, `salesForce`, `accountId`, `statusId`, `charge`) VALUES
  (1, 'default', 'account.item-default', '', 1, 1, 0);


--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `tab_accounts`
--
ALTER TABLE `@prefix@tab_accounts`
ADD CONSTRAINT `fk_accounts_statusId` FOREIGN KEY (`statusId`) REFERENCES `@prefix@tab_accounts_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `tab_accounts_items`
--
ALTER TABLE `@prefix@tab_accounts_items`
ADD CONSTRAINT `fk_accounts_items_status` FOREIGN KEY (`statusId`) REFERENCES `@prefix@tab_accounts_items_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_items_accountId` FOREIGN KEY (`accountId`) REFERENCES `@prefix@tab_accounts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `@prefix@tab_events` ADD `itemId` INT(11) NOT NULL DEFAULT '1' AFTER `locationId`;
ALTER TABLE `@prefix@tab_events` ADD INDEX( `itemId`);
ALTER TABLE `@prefix@tab_events` ADD  CONSTRAINT `fk_events_items` FOREIGN KEY (`itemId`) REFERENCES `@prefix@tab_accounts_items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


SET FOREIGN_KEY_CHECKS=1;