<?php
namespace Ring;

require '../header.php';
require '../vendor/autoload.php';
require '../include/config.php';

use Oda\OdaLibInterface;
use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$params->arrayInput = array("id");
$params->modePublic = false;
$INTERFACE = new OdaLibInterface($params);

//--------------------------------------------------------------------------
$params = new OdaPrepareReqSql();
$params->sql = "UPDATE `tab_events`
SET
`active`= 0,
`googleId`= '',
`googleHtmlLink`= '',
`googleICalUID`= ''
WHERE 1=1
AND `id` = :id
;";
$params->bindsValue = [
    "id" => $INTERFACE->inputs["id"]
];
$params->typeSQL = OdaLibBd::SQL_SCRIPT;
$retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

$params = new stdClass();
$params->value = $retour->data;
$INTERFACE->addDataStr($params);