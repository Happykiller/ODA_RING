<?php

namespace Project;

require '../../header.php';
require "../../vendor/autoload.php";
require '../../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
//Build the interface
$params = new OdaPrepareInterface();
$INTERFACE = new ProjectInterface($params);
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

$app->get('/entity/:id', function ($id) use ($INTERFACE, $odaOffset, $odaLimit) {
    $INTERFACE->addDataStr("HelloWorld");
});

$app->run();