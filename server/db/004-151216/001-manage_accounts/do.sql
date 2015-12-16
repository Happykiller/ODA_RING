SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------

INSERT INTO `@prefix@api_tab_menu` (`Description`, `Description_courte`, `id_categorie`, `Lien`) VALUES ('manage-accounts.title', 'manage-accounts.title', '3', 'manage-accounts');

UPDATE `@prefix@api_tab_menu_rangs_droit` a
  INNER JOIN `@prefix@api_tab_menu` b
    ON b.`Lien` = 'manage-accounts'
  INNER JOIN `@prefix@api_tab_rangs` c
    ON c.`id` = a.`id_rang`
       AND c.`indice` in (1,10,20,30)
SET `id_menu` = concat(`id_menu`,b.`id`,';');

ALTER TABLE `@prefix@tab_accounts` ADD `userId` INT(11) NOT NULL ;
ALTER TABLE `@prefix@tab_accounts` ADD INDEX(`userId`);
ALTER TABLE `@prefix@tab_accounts` ADD CONSTRAINT `fk_accounts_usersId` FOREIGN KEY (`userId`) REFERENCES `@prefix@api_tab_utilisateurs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `@prefix@tab_accounts_items` ADD `userId` INT(11) NOT NULL ;
ALTER TABLE `@prefix@tab_accounts_items` ADD INDEX(`userId`);
ALTER TABLE `@prefix@tab_accounts_items` ADD CONSTRAINT `fk_accounts_items_usersId` FOREIGN KEY (`userId`) REFERENCES `@prefix@api_tab_utilisateurs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `@prefix@tab_accounts` ADD UNIQUE(`code`);

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;