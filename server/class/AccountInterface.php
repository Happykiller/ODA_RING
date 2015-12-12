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
class AccountInterface extends OdaRestInterface {
    /**
     */
    function get() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`, a.`code`, a.`label`, a.`salesForce`,
                a.`statusId`, b.`label` as  'statusLabel', b.`active` as 'statusActive'
                FROM `tab_accounts` a, `tab_accounts_status` b
                WHERE 1=1
                AND a.`statusId` = b.`id`
            ;";
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
     *
     */
    public function getOnlyWithItem()
    {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT DISTINCT a.`id`, a.`code`, a.`label`, a.`salesForce`,
                a.`statusId`, b.`label` as  'statusLabel', b.`active` as 'statusActive'
                FROM `tab_accounts` a, `tab_accounts_status` b, `tab_accounts_items` c
                WHERE 1=1
                AND a.`statusId` = b.`id`
                AND a.`id` = c.`accountId`
                and c.`statusId` != 3
            ;";
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
    function getItemByAccount($accountId) {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "SELECT a.`id`,a.`code`,a.`label`,a.`salesForce`,a.`charge`,
                a.`statusId`,b.`label` as 'statusLabel', b.`active` as 'statusActive',
                a.`accountId`, c.`code` as 'accountCode', c.`label` as 'accountLabel', c.`salesForce` as 'accountSaleForce',
                c.`statusId` as 'accountStatusId', d.`label` as  'accountStatusLabel', d.`active` as 'accountStatusActive'
                FROM `tab_accounts_items` a, `tab_accounts_items_status` b, `tab_accounts` c, `tab_accounts_status` d
                WHERE 1=1
                AND a.`statusId` = b.`id`
                AND a.`accountId` = c.`id`
                AND c.`statusId` = d.`id`
                AND a.`accountId` = :accountId
            ;";
            $params->bindsValue = [
                "accountId" => $accountId
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