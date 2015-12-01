INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('activity.title', 'activity.title', '3', 'activity');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'activity'
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
  `billable` tinyint(1) NOT NULL DEFAULT '0',
  `googleCalendarId` varchar(500),
  `salesForceId` varchar(500),
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `dateRecord` datetime NOT NULL,
  `autorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autorId` (`autorId`),
  KEY `typeId` (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Contraintes pour la table `tab_events`
--
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_autorId` FOREIGN KEY (`autorId`) REFERENCES `@prefix@api_tab_utilisateurs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_typeId` FOREIGN KEY (`typeId`) REFERENCES `@prefix@tab_events_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;