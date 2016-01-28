SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
UPDATE `@prefix@tab_events_type` SET `code` = 'EXP' WHERE `code` = 'expertise';
UPDATE `@prefix@tab_events_type` SET `code` = 'TRIP' WHERE `code` = 'trip';
UPDATE `@prefix@tab_events_type` SET `code` = 'HOLIDAYS' WHERE `code` = 'abs';
UPDATE `@prefix@tab_events_type` SET `code` = 'SELF TRAINING' WHERE `code` = 'assist';
UPDATE `@prefix@tab_events_type` SET `code` = 'CORPORATE' WHERE `code` = 'corporate';
UPDATE `@prefix@tab_events_type` SET `code` = 'PREPUP' WHERE `code` = 'pre-up';
UPDATE `@prefix@tab_events_type` SET `code` = 'PUBLIC TRAINING' WHERE `code` = 'training';
UPDATE `@prefix@tab_events_type` SET `code` = 'SUPPORT' WHERE `code` = 'case';
UPDATE `@prefix@tab_events_type` SET `code` = 'INTERNAL' WHERE `code` = 'free';

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;