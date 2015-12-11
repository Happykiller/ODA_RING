<?php
namespace Ring;

use Exception;
use Oda\OdaLibBd;
use Oda\OdaRestInterface;
use Oda\SimpleObject\OdaPrepareReqSql;
use \stdClass;

/**
 * Project class
 *
 * Tool
 *
 * @author  Fabrice Rosito <rosito.fabrice@gmail.com>
 * @version 0.150221
 */
class EventInterface extends OdaRestInterface {
    /**
     * @param $id
     */
    function get($id) {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`typeId`, a.`tmp`, a.`time`, a.`cmt`, a.`locationId`,
                a.`active`, a.`billable`, a.`synGoogle`, a.`googleEtag`, a.`googleId`, a.`googleHtmlLink`, a.`googleICalUID`, a.`synSF`, a.`salesForceId`,
                a.`itemId`, b.`accountId`
                FROM `tab_events` a, `tab_accounts_items` b
                WHERE 1=1
                AND a.`id` = :id
                AND a.`itemId` = b.`id`
            ;";
            $params->bindsValue = [
                "id" => $id
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->retourSql = $retour;
            $this->addDataObject($retour->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     */
    function create() {
        try {
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
                    `locationId`,
                    `billable`,
                    `synGoogle`,
                    `synSF`,
                    `dateRecord`,
                    `autorId`
                )
                VALUES (
                    :title, :start, :end, :allDay, :type, :tmp, :time, :cmt, :locationId, :billable, :synchGoogle, :synchSF, NOW(), :autorId
                )
            ;";
            $params->bindsValue = [
                "title" => $this->inputs["title"],
                "start" => $this->inputs["start"],
                "autorId" => $this->inputs["autorId"],
                "end" => $this->inputs["end"],
                "tmp" => $this->inputs["tmp"],
                "allDay" => $this->inputs["allDay"],
                "type" => $this->inputs["type"],
                "time" => $this->inputs["time"],
                "cmt" => $this->inputs["cmt"],
                "locationId" => $this->inputs["locationId"],
                "billable" => $this->inputs["billable"],
                "synchGoogle" => $this->inputs["synchGoogle"],
                "synchSF" => $this->inputs["synchSF"]
            ];
            $params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $id
     */
    function getByUser($id) {
        try {
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
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->retourSql = $retour;
            $this->addDataObject($retour->data->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     */
    function getAll() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`typeId`, a.`tmp`, a.`time`, a.`cmt`, a.`locationId`, a.`active`, a.`billable`, a.`synGoogle`, a.`googleEtag`, a.`googleId`, a.`googleHtmlLink`, a.`googleICalUID`, a.`synSF`, a.`salesForceId`
                FROM `tab_events` a
                WHERE 1=1
                LIMIT :odaOffset, :odaLimit
            ;";
            $params->bindsValue = [
                "odaOffset" => $this->odaOffset,
                "odaLimit" => $this->odaLimit
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->retourSql = $retour;
            $this->addDataObject($retour->data->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     */
    function getTypes() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`code`, a.`className`, a.`label`, a.`active`
                FROM `tab_events_type` a
                WHERE 1=1
                ORDER BY a.`code`
                LIMIT :odaOffset, :odaLimit
            ;";
            $params->bindsValue = [
                "odaOffset" => $this->odaOffset,
                "odaLimit" => $this->odaLimit
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->retourSql = $retour;
            $this->addDataObject($retour->data->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $id
     */
    function delete($id) {
        try {
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
                "id" => $id
            ];
            $params->typeSQL = OdaLibBd::SQL_SCRIPT;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $id
     */
    function update($id) {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "UPDATE `tab_events`
                SET
                    `title`= :title,
                    `allDay`= :allDay,
                    `start`= :start,
                    `end`= :end,
                    `typeId`= :type,
                    `tmp`= :tmp,
                    `locationId` = :locationId,
                    `time`= :time,
                    `cmt`= :cmt,
                    `billable`= :billable,
                    `synGoogle`= :synchGoogle,
                    `synSF`= :synchSF
                WHERE 1=1
                  AND `id` = :id
            ;";
            $params->bindsValue = [
                "title" => $this->inputs["title"],
                "start" => $this->inputs["start"],
                "end" => $this->inputs["end"],
                "tmp" => $this->inputs["tmp"],
                "allDay" => $this->inputs["allDay"],
                "type" => $this->inputs["type"],
                "time" => $this->inputs["time"],
                "cmt" => $this->inputs["cmt"],
                "locationId" => $this->inputs["locationId"],
                "id" => $id,
                "billable" => $this->inputs["billable"],
                "synchGoogle" => $this->inputs["synchGoogle"],
                "synchSF" => $this->inputs["synchSF"]
            ];
            $params->typeSQL = OdaLibBd::SQL_SCRIPT;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     * @param $id
     */
    public function updateGoogle($id){
        try {
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
                "id" => $id,
                "googleEtag" => $this->inputs["googleEtag"],
                "googleId" => $this->inputs["googleId"],
                "googleHtmlLink" => $this->inputs["googleHtmlLink"],
                "googleICalUID" => $this->inputs["googleICalUID"]
            ];
            $params->typeSQL = OdaLibBd::SQL_SCRIPT;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->value = $retour->data;
            $this->addDataStr($params);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }

    /**
     *
     */
    public function getLocations(){
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`code`, a.`label`, a.`active`
                FROM `tab_events_location` a
                WHERE 1=1
                ORDER BY a.`id`
                LIMIT :odaOffset, :odaLimit
            ;";
            $params->bindsValue = [
                "odaOffset" => $this->odaOffset,
                "odaLimit" => $this->odaLimit
            ];
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            $params = new stdClass();
            $params->retourSql = $retour;
            $this->addDataObject($retour->data->data);
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }
}