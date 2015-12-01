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
  `active` TINYINT(1) NOT NULL DEFAULT '1' ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

INSERT INTO `@prefix@tab_events_type` (`code`, `className`, `label`)
VALUES
  ('free', 'code-green', 'activity.type-free'),
  ('billable', 'code-blue', 'activity.type-billable')
;

--
-- Structure de la table `tab_events`
--

CREATE TABLE IF NOT EXISTS `@prefix@tab_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL,
  `allDay` tinyint(1) NOT NULL,
  `start` varchar(500) NOT NULL,
  `end` varchar(500) NOT NULL,
  `url` varchar(500) NOT NULL,
  `typeId` int(11) NOT NULL,
  `tmp` tinyint(1) NOT NULL,
  `time` DECIMAL(2,2) NOT NULL,
  `cmt` TEXT NOT NULL,
  `active` tinyint(1) NOT NULL,
  `dateRecord` date NOT NULL,
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