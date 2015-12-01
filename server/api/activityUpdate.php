<?php
namespace Ring;

require '../header.php';
require '../vendor/autoload.php';
require '../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$params->arrayInput = array("title","start","end","tmp","allDay","type", "time", "cmt", "id");
$params->modePublic = false;
$INTERFACE = new RingInterface($params);

//--------------------------------------------------------------------------
// api/activityUpdate.php?title=test&startDate=2015-11-30

//--------------------------------------------------------------------------
$params = new OdaPrepareReqSql();
$params->sql = "UPDATE `tab_events`
SET
`title`= :title,
`allDay`= :allDay,
`start`= :start,
`end`= :end,
`typeId`= :type,
`tmp`= :tmp,
`time`= :time,
`cmt`= :cmt
WHERE 1=1
AND `id` = :id
;";
$params->bindsValue = [
    "title" => $INTERFACE->inputs["title"],
    "start" => $INTERFACE->inputs["start"],
    "end" => $INTERFACE->inputs["end"],
    "tmp" => $INTERFACE->inputs["tmp"],
    "allDay" => $INTERFACE->inputs["allDay"],
    "type" => $INTERFACE->inputs["type"],
    "time" => $INTERFACE->inputs["time"],
    "cmt" => $INTERFACE->inputs["cmt"],
    "id" => $INTERFACE->inputs["id"]
];
$params->typeSQL = OdaLibBd::SQL_SCRIPT;
$retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

$params = new stdClass();
$params->value = $retour->data;
$INTERFACE->addDataStr($params);