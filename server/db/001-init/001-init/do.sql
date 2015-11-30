INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('activity.title', 'activity.title', '3', 'activity');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'activity'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

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
  `className` varchar(500) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `dateRecord` date NOT NULL,
  `autorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autorId` (`autorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `tab_events`
--
ALTER TABLE `@prefix@tab_events`
ADD CONSTRAINT `fk_autorId` FOREIGN KEY (`autorId`) REFERENCES `@prefix@api_tab_utilisateurs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;