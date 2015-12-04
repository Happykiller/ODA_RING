<?php

namespace Ring;

require '../../header.php';
require "../../vendor/autoload.php";
require '../../include/config.php';

use \stdClass, \Oda\SimpleObject\OdaPrepareInterface, \Oda\OdaRestInterface, \Oda\OdaLibBd;

//--------------------------------------------------------------------------
$slim = new \Slim\Slim();

$slim->notFound(function () {
    $params = new OdaPrepareInterface();
    $INTERFACE = new OdaRestInterface($params);
    $INTERFACE->dieInError('not found');
});

$slim->get('/', function () {
    $markdown = file_get_contents('./doc.markdown', true);
    $parser = new \cebe\markdown\GithubMarkdown();
    echo $parser->parse($markdown);
});

$slim->get('/config/search/user/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new ConfigInterface($params);
    $INTERFACE->getByUser($id);
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
    $params->arrayInput = array("title","start","end","tmp","allDay","type", "time", "cmt", "billable","synchGoogle","synchSF");
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

$slim->get('/event/search/user/:id', function ($id) use ($slim) {
    $params = new OdaPrepareInterface();
    $params->slim = $slim;
    $INTERFACE = new EventInterface($params);
    $INTERFACE->getByUser($id);
});

$slim->run();