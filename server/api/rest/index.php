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

$app->get('/event/userId/:id', function ($id) use ($INTERFACE, $odaOffset, $odaLimit) {
    $params = new OdaPrepareReqSql();
    $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`className`, a.`active`
        FROM `tab_events` a
        WHERE 1=1
        AND a.`autorId` = :id
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