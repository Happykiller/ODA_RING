<?php
namespace Ring;

require '../header.php';
require '../vendor/autoload.php';
require '../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$params->arrayInput = array("title","start","end","tmp","allDay","autorId","type", "time", "cmt","billable","synchGoogle","synchSF");
$params->modePublic = false;
$INTERFACE = new RingInterface($params);

//--------------------------------------------------------------------------
// api/activityNew.php?title=test&startDate=2015-11-30

//--------------------------------------------------------------------------
$params = new OdaPrepareReqSql();
$params->sql = "INSERT INTO  `tab_events` (
        `title` ,
        `start`,
        `end`,
        `allDay`,
        `typeId`,
        `tmp`,
        `time`,
        `cmt`,
        `billable`,
        `synGoogle`,
        `synSF`,
        `dateRecord`,
        `autorId`
    )
    VALUES (
        :title, :start, :end, :allDay, :type, :tmp, :time, :cmt, :billable, :synchGoogle, :synchSF, NOW(), :autorId
    )
;";
$params->bindsValue = [
    "title" => $INTERFACE->inputs["title"],
    "start" => $INTERFACE->inputs["start"],
    "autorId" => $INTERFACE->inputs["autorId"],
    "end" => $INTERFACE->inputs["end"],
    "tmp" => $INTERFACE->inputs["tmp"],
    "allDay" => $INTERFACE->inputs["allDay"],
    "type" => $INTERFACE->inputs["type"],
    "time" => $INTERFACE->inputs["time"],
    "cmt" => $INTERFACE->inputs["cmt"],
    "billable" => $INTERFACE->inputs["billable"],
    "synchGoogle" => $INTERFACE->inputs["synchGoogle"],
    "synchSF" => $INTERFACE->inputs["synchSF"]
];
$params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
$retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

$params = new stdClass();
$params->value = $retour->data;
$INTERFACE->addDataStr($params);