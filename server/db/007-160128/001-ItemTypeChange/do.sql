SET FOREIGN_KEY_CHECKS=0;
-- --------------------------------------------------------
UPDATE `@prefix@tab_events_type` SET `className`= 'code-turquoise', `label` = 'activity-type.expertise' WHERE `code` = 'EXP';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-emerald', `label` = 'activity-type.trip' WHERE `code` = 'TRIP';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-peterRiver', `label` = 'activity-type.holidays' WHERE `code` = 'HOLIDAYS';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-amethyst', `label` = 'activity-type.selfTraining' WHERE `code` = 'SELF TRAINING';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-wetAsphalt', `label` = 'activity-type.corporate' WHERE `code` = 'CORPORATE';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-greenSea', `label` = 'activity-type.preup' WHERE `code` = 'PREPUP';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-nephritis', `label` = 'activity-type.publicTraining' WHERE `code` = 'PUBLIC TRAINING';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-belizeHole', `label` = 'activity-type.support' WHERE `code` = 'SUPPORT';
UPDATE `@prefix@tab_events_type` SET `className`= 'code-wisteria', `label` = 'activity-type.internal' WHERE `code` = 'INTERNAL';

INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('PRESALES', 'code-midnightBlue', 'activity-type.preSales');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('CUSTOMER SUCCESS', 'code-sunFlower', 'activity-type.customerSuccess');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('PRIVATE TRAINING', 'code-carrot', 'activity-type.privateTraining');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('DELIVERY REPORT', 'code-alizarin', 'activity-type.delivery-report');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('ADMIN', 'code-clouds', 'activity-type.admin');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('SALES', 'code-concrete', 'activity-type.sales');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('MIGRATION SIZING', 'code-orange', 'activity-type.migrationSizing');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('PROJECT FOLLOW UP', 'code-pumkin', 'activity-type.projectFollowUp');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('REACTIVATION', 'code-pomegranate', 'activity-type.reactivation');
INSERT INTO `@prefix@tab_events_type`(`code`, `className`, `label`) VALUES ('SICK DAYS', 'code-silver', 'activity-type.sickDays');

-- --------------------------------------------------------
SET FOREIGN_KEY_CHECKS=1;