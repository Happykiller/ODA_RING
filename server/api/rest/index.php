<?php

namespace Ring;

require '../../header.php';
require "../../vendor/autoload.php";
require '../../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$INTERFACE = new RingInterface($params);
$app = new \Slim\Slim();

$odaOffset = $app->request->params('odaOffset');
if(is_null($odaOffset)){
    $odaOffset = 0;
}else{
    $odaOffset = intval($odaOffset);
}
$odaLimit = $app->request->params('odaLimit');
if(is_null($odaLimit)){
    $odaLimit = 9999;
}else{
    $odaLimit = intval($odaLimit);
}

$app->notFound(function () use ($INTERFACE) {
    $INTERFACE->dieInError('not found');
});

$app->get('/config/:userId', function ($userId) use ($INTERFACE, $odaOffset, $odaLimit) {
    $params = new OdaPrepareReqSql();
    $params->sql = "SELECT a.`id`, a.`userId`, a.`activityGoogleCalendar`
        FROM `tab_config` a
        WHERE 1=1
        AND a.`userId` = :userId
    ;";
    $params->bindsValue = [
        "userId" => $userId
    ];
    $params->typeSQL = OdaLibBd::SQL_GET_ONE;
    $retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

    $params = new stdClass();
    $params->retourSql = $retour;
    $INTERFACE->addDataObject($retour->data);
});

$app->get('/event/:id', function ($id) use ($INTERFACE, $odaOffset, $odaLimit) {
    $params = new OdaPrepareReqSql();
    $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`typeId`, a.`tmp`, a.`time`, a.`cmt`, a.`active`, a.`billable`, a.`synGoogle`, a.`googleEtag`, a.`googleId`, a.`googleHtmlLink`, a.`googleICalUID`, a.`synSF`, a.`salesForceId`
        FROM `tab_events` a
        WHERE 1=1
        AND a.`id` = :id
    ;";
    $params->bindsValue = [
        "id" => $id
    ];
    $params->typeSQL = OdaLibBd::SQL_GET_ONE;
    $retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

    $params = new stdClass();
    $params->retourSql = $retour;
    $INTERFACE->addDataObject($retour->data);
});

$app->get('/event/type/', function () use ($INTERFACE, $odaOffset, $odaLimit) {
    $params = new OdaPrepareReqSql();
    $params->sql = "SELECT a.`id`, a.`code`, a.`className`, a.`label`, a.`active`
        FROM `tab_events_type` a
        WHERE 1=1
        ORDER BY a.`code`
    ;";
    $params->typeSQL = OdaLibBd::SQL_GET_ALL;
    $retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

    $params = new stdClass();
    $params->retourSql = $retour;
    $INTERFACE->addDataObject($retour->data->data);
});

$app->get('/event/userId/:id', function ($id) use ($INTERFACE, $odaOffset, $odaLimit) {
    $params = new OdaPrepareReqSql();
    $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, b.`className`, a.`tmp`, a.`active`
        FROM `tab_events` a, `tab_events_type` b
        WHERE 1=1
        AND a.`typeId` = b.`id`
        AND a.`autorId` = :id
        AND a.`active` = 1
        ORDER BY a.`id`
    ;";
    $params->bindsValue = [
        "id" => $id
    ];
    $params->typeSQL = OdaLibBd::SQL_GET_ALL;
    $retour = $INTERFACE->BD_ENGINE->reqODASQL($params);

    $params = new stdClass();
    $params->retourSql = $retour;
    $INTERFACE->addDataObject($retour->data->data);
});

$app->run();