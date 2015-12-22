INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('activity.title', 'activity.title', '3', 'activity');
INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('activity-list.title', 'activity-list.title', '4', 'activity-list');
INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('activity-rapport-client.title', 'activity-rapport-client.title', '4', 'activity-rapport-client');
INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('manage-accounts.title', 'manage-accounts.title', '3', 'manage-accounts');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'activity'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'activity-list'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'activity-rapport-client'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'manage-accounts'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

--
-- Structure de la table `tab_events_statut`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_events_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `className` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

INSERT INTO `@prefix@tab_events_type` (`code`, `className`, `label`)
VALUES
  ('free', 'code-green', 'activity.type-free'),
  ('expertise', 'code-yellow', 'activity.type-expertise'),
  ('trip', 'code-blue', 'activity.type-trip'),
  ('case', 'code-red', 'activity.type-case'),
  ('training', 'code-orange', 'activity.type-training'),
  ('pre-up', 'code-violet', 'activity.type-preup'),
  ('corporate', 'code-aqua', 'activity.type-corporate'),
  ('assist', 'code-black', 'activity.type-assist'),
  ('abs', 'code-grey', 'activity.type-abs')
;

--
-- Structure de la table `tab_events_location`
--

CREATE TABLE IF NOT EXISTS `tab_events_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(500) NOT NULL,
  `label` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `tab_events_location`
--

INSERT INTO `tab_events_location` (`id`, `code`, `label`) VALUES
  (0, 'default', 'oda-main.select-default'),
  (1, 'office', 'activity.location-office'),
  (2, 'client', 'activity.location-client');

--
-- Structure de la table `tab_events`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `allDay` tinyint(1) NOT NULL DEFAULT '0',
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `url` varchar(500),
  `typeId` int(11) NOT NULL,
  `tmp` tinyint(1) NOT NULL,
  `time` DECIMAL(4,2) NOT NULL,
  `cmt` TEXT NOT NULL,
  `billable` tinyint(1) NOT NULL DEFAULT 0,
  `locationId` int(11) NOT NULL DEFAULT 0,
  `itemId` int(11) NOT NULL DEFAULT 1,
  `synGoogle` tinyint(1) NOT NULL DEFAULT 0,
  `googleEtag` varchar(500) NOT NULL,
  `googleId` varchar(500) NOT NULL,
  `googleHtmlLink` varchar(1000) NOT NULL,
  `googleICalUID` varchar(500) NOT NULL,
  `synSF` tinyint(1) NOT NULL DEFAULT 0,
  `salesForceId` varchar(500) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `dateRecord` datetime NOT NULL,
  `autorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autorId` (`autorId`),
  KEY `typeId` (`typeId`),
  KEY `locationId` (`locationId`),
  KEY `itemId` (`itemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Contraintes pour la table `tab_events`
--
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_autorId` FOREIGN KEY (`autorId`) REFERENCES `@prefix@api_tab_utilisateurs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_typeId` FOREIGN KEY (`typeId`) REFERENCES `@prefix@tab_events_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_locationId` FOREIGN KEY (`locationId`) REFERENCES `@prefix@tab_events_location` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `@prefix@tab_events` ADD  CONSTRAINT `fk_events_items` FOREIGN KEY (`itemId`) REFERENCES `@prefix@tab_accounts_items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Structure de la table `tab_config`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `activityGoogleCalendar` varchar(500) NOT NULL DEFAULT 'primary',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `tab_config`
--
ALTER TABLE `@prefix@tab_config`
ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `@prefix@api_tab_utilisateurs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
