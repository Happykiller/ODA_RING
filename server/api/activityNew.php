<?php
namespace Ring;

require '../header.php';
require '../vendor/autoload.php';
require '../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$params->arrayInput = array("title","start","autorId");
$params->modePublic = false;
$INTERFACE = new RingInterface($params);

//--------------------------------------------------------------------------
// api/activityNew.php?title=test&startDate=2015-11-30

//--------------------------------------------------------------------------
$params = new OdaPrepareReqSql();
$params->sql = "INSERT INTO  `tab_events` (
        `title` ,
        `start`,
        `allDay`,
        `typeId`,
        `dateRecord`,
        `autorId`
    )
    VALUES (
        :title , :start, 1, 1, NOW(), :autorId
    )
;";
$params->bindsValue = [
    "title" => $INTERFACE->inputs["title"],
    "start" => $INTERFACE->inputs["start"],
    "autorId" => $INTERFACE->inputs["autorId"]
];
$params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
$retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

$params = new stdClass();
$params->value = $retour->data;
$INTERFACE->addDataStr($params);