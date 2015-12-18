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
class RapportInterface extends OdaRestInterface {
    /**
     */
    function get() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`typeId`, a.`tmp`, a.`time`, a.`cmt`, a.`locationId`, a.`active`, a.`billable`, a.`synGoogle`, a.`googleEtag`, a.`googleId`, a.`googleHtmlLink`, a.`googleICalUID`, a.`synSF`, a.`salesForceId`
                FROM `tab_events` a
                WHERE 1=1
            ;";
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
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
    function getEvents() {
        try {
            $filtreAccount = "";
            if((!is_null($this->inputs["accountId"]))&&($this->inputs["accountId"] !== "0")){
                $filtreAccount = " AND b.`accountId` = ".$this->inputs["accountId"];
            }

            $filtreBillable = "";
            if((!is_null($this->inputs["billable"]))&&($this->inputs["billable"] !== "")){
                $filtreBillable = " AND a.`billable` = ".$this->inputs["billable"];
            }

            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`title`, a.`allDay`, a.`start`, a.`end`, a.`url`, a.`typeId`, a.`tmp`, a.`time`, a.`cmt`,
                a.`locationId`, a.`active`, a.`billable`, a.`synGoogle`, a.`googleEtag`, a.`googleId`, a.`googleHtmlLink`,
                a.`googleICalUID`, a.`synSF`, a.`salesForceId`,
                a.`itemId`, b.`code` as 'itemCode', b.`label` as 'itemLabel', b.`charge` as 'itemCharge',
                a.`autorId`, c.`nom` as 'userLastName', c.`prenom` as 'userFirstName',
                b.`accountId`, d.`code` as 'accountCode', d.`label` as 'accountLabel'
                FROM `tab_events` a, `tab_accounts_items` b, `api_tab_utilisateurs` c, `tab_accounts` d
                WHERE 1=1
                AND a.`itemId` = b.`id`
                AND a.`autorId` = c.`id`
                and b.`accountId` = d.`id`
                AND a.`tmp` = 0
                ${filtreBillable}
                ${filtreAccount}
                ORDER BY a.`start`
            ;";
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
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
    function getPieActivityType() {
        try {
            $filtreUser = "";

            if(!is_null($this->inputs["userId"])){
                $filtreUser = " AND a.`autorId` = ".$this->inputs["userId"];
            }

            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT b.`typeId`, b.`sumTime`, c.`className`, c.`code`, c.`label`
                FROM (
                  SELECT a.`typeId`, SUM(a.`time`) as 'sumTime'
                  FROM `tab_events` a
                  WHERE 1=1
                  ${filtreUser}
                  GROUP BY a.`typeId`
                ) b, `tab_events_type` c
                WHERE 1=1
                AND c.`code` != 'abs'
                AND b.`typeId` = c.`id`
            ;";
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
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
    function getPieLocation() {
        try {
            $filtreUser = "";

            if(!is_null($this->inputs["userId"])){
                $filtreUser = " AND a.`autorId` = ".$this->inputs["userId"];
            }

            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT b.`locationId`, b.`sumTime`, c.`code`, c.`label`
                FROM (
                  SELECT a.`locationId`, SUM(a.`time`) as 'sumTime'
                  FROM `tab_events` a
                  WHERE 1=1
                  ${filtreUser}
                  GROUP BY a.`locationId`
                ) b, `tab_events_location` c
                WHERE 1=1
                AND c.`code` != 'default'
                AND b.`locationId` = c.`id`
            ;";
            $params->typeSQL = OdaLibBd::SQL_GET_ALL;
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
}