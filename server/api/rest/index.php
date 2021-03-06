<?php

namespace Ring;

require '../../header.php';
require "../../vendor/autoload.php";
require '../../config/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\OdaRestInterface, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
$slim = new \Slim\Slim();

$slim->notFound(function () use ($slim)  {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new OdaRestInterface($params);
    $INTERFACE->dieInError('not found');
});

$slim->get('/', function () {
    $markdown = file_get_contents('./doc.markdown', true);
    $parser = new \cebe\markdown\GithubMarkdown();
    echo $parser->parse($markdown);
});

//----------- CONFIG -------------------------------
$slim->get('/config/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new ConfigInterface($params);
    $INTERFACE->get();
});

$slim->get('/config/search/user/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new ConfigInterface($params);
    $INTERFACE->getByUser($id);
});

//----------- ENENT -------------------------------
$slim->get('/event/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getAll();
});

$slim->post('/event/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("title","start","end","tmp","allDay","autorId","type", "time",
        "cmt", "locationId", "billable","synchGoogle","synchSF", "itemId");
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
    $params->arrayInput = array("title","start","end","tmp","allDay","type", "time", "cmt", "locationId", "billable","synchGoogle","synchSF","itemId");
    $params->modePublic = false;
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->update($id);
});

$slim->delete('/event/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->modePublic = false;
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->delete($id);
});

$slim->put('/event/:id/googleCalendar/', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->modePublic = false;
    $params->arrayInput = array("googleEtag","googleId","googleHtmlLink","googleICalUID");
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->updateGoogle($id);
});

$slim->get('/event/type/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getTypes();
});

$slim->get('/event/location/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getLocations();
});

$slim->get('/event/search/user/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getByUser($id);
});

//----------- RAPPORTS -------------------------------
$slim->get('/rapport/event/client/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInputOpt = array("accountId"=>null,"billable"=>null);
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getEvents();
});

$slim->get('/rapport/event/type/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInputOpt = array("userId"=>null, "nbMonth"=>null);
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getPieActivityType();
});

$slim->get('/rapport/event/location/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInputOpt = array("userId"=>null, "nbMonth"=>null);
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getPieLocation();
});

$slim->get('/rapport/event/consolidated/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getConsolidated();
});

$slim->get('/rapport/event/forStaff/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("userId", "startDate", "endDate");
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getForStaff();
});

$slim->get('/rapport/day/completion/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInputOpt = array("startDate"=>null, "endDate"=>null);
    $params->slim = $slim;
    $INTERFACE = new RapportInterface($params);
    $INTERFACE->getDayCompletion($id);
});

//----------- ACCOUNT -------------------------------

$slim->get('/account/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInputOpt = array("withItem"=>"false", "mode"=>"light");
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    if($INTERFACE->inputs["withItem"] === "true"){
        $INTERFACE->getOnlyWithItem();
    }elseif($INTERFACE->inputs["mode"] === "full") {
        $INTERFACE->getFull();
    }else{
        $INTERFACE->get();
    }
});

$slim->post('/account/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("code","label","salesForce","userId");
    $params->modePublic = false;
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->create();
});

$slim->get('/account/item/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->getItem();
});

$slim->post('/account/item/', function () use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("code","label","salesForce","userId", "accountId", "charge");
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->createItem();
});

$slim->put('/account/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("code","label","salesForce");
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->updateAccount($id);
});

$slim->put('/account/item/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->arrayInput = array("code","label","salesForce","charge");
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->updateItem($id);
});

$slim->get('/account/:id/search/item', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new AccountInterface($params);
    $INTERFACE->getItemByAccount($id);
});

$slim->run();