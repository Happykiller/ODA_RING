SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
ALTER TABLE `@prefix@tab_config` CHANGE `activityGoogleCalendar` `activityGoogleCalendar` VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'primary';
ALTER TABLE `@prefix@tab_config` ADD `active` TINYINT(1) NOT NULL DEFAULT '1' ;
-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;