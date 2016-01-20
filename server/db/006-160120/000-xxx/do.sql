SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
UPDATE `tab_events_type` SET `code` = 'EXP' WHERE `code` = 'expertise';
UPDATE `tab_events_type` SET `code` = 'TRIP' WHERE `code` = 'trip';
UPDATE `tab_events_type` SET `code` = 'HOLIDAYS' WHERE `code` = 'abs';
UPDATE `tab_events_type` SET `code` = 'SELF TRAINING' WHERE `code` = 'assist';
UPDATE `tab_events_type` SET `code` = 'CORPORATE' WHERE `code` = 'corporate';
UPDATE `tab_events_type` SET `code` = 'PREPUP' WHERE `code` = 'pre-up';
UPDATE `tab_events_type` SET `code` = 'PUBLIC TRAINING' WHERE `code` = 'training';
UPDATE `tab_events_type` SET `code` = 'SUPPORT' WHERE `code` = 'case';
UPDATE `tab_events_type` SET `code` = 'INTERNAL' WHERE `code` = 'free';

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;