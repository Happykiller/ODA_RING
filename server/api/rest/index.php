<?php

namespace Ring;

require '../../header.php';
require "../../vendor/autoload.php";
require '../../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\SimpleObject\OdaPrepareReqSql, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
$slim = new \Slim\Slim();

$slim->notFound(function () {
    //Build the interface
    $params = new OdaPrepareInterface();
    $INTERFACE = new RingInterface($params);
    $INTERFACE->dieInError('not found');
});

//todo go in filtre /search/userId/:userId
$slim->get('/config/:userId', function ($userId) use ($slim) {
    //Build the interface
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new ConfigInterface($params);
    $INTERFACE->get($userId);
});

$slim->get('/event/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getAll();
});

$slim->post('/event/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("title","start","end","tmp","allDay","autorId","type", "time", "cmt","billable","synchGoogle","synchSF");
    $params->modePublic = false;
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->create();
});

$slim->get('/event/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->get($id);
});

$slim->put('/event/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("essai");
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
});

$slim->delete('/event/:id', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("essai");
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
});

$slim->put('/event/:id/googleCalendar/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("essai");
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
});

$slim->get('/event/type/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getTypes();
});

//todo go in filtre /search/userId/:userId
$slim->get('/event/userId/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getForUser($id);
});

$slim->run();