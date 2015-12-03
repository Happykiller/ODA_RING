<?php
namespace Ring;

require '../header.php';
require '../vendor/autoload.php';
require '../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$params->arrayInput = array("id","googleEtag","googleId","googleHtmlLink","googleICalUID");
$params->modePublic = false;
$INTERFACE = new RingInterface($params);

//--------------------------------------------------------------------------
$params = new OdaPrepareReqSql();
$params->sql = "UPDATE `tab_events`
SET
`googleEtag`= :googleEtag,
`googleId`= :googleId,
`googleHtmlLink`= :googleHtmlLink,
`googleICalUID`= :googleICalUID
WHERE 1=1
AND `id` = :id
;";
$params->bindsValue = [
    "id" => $INTERFACE->inputs["id"],
    "googleEtag" => $INTERFACE->inputs["googleEtag"],
    "googleId" => $INTERFACE->inputs["googleId"],
    "googleHtmlLink" => $INTERFACE->inputs["googleHtmlLink"],
    "googleICalUID" => $INTERFACE->inputs["googleICalUID"]
];
$params->typeSQL = OdaLibBd::SQL_SCRIPT;
$retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

$params = new stdClass();
$params->value = $retour->data;
$INTERFACE->addDataStr($params);