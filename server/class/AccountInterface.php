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
    function create() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "INSERT INTO  `tab_accounts` (
                    `code` ,
                    `label`,
                    `salesForce`,
                    `userId`,
                    `statusId`
                )
                VALUES (
                    :code, :label, :salesForce, :userId, 2
                )
            ;";
            $params->bindsValue = [
                "code" => $this->inputs["code"],
                "label" => $this->inputs["label"],
                "salesForce" => $this->inputs["salesForce"],
                "userId" => $this->inputs["userId"]
            ];
            $params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
            $retour = $this->BD_ENGINE->reqODASQL($params);

            if($retour->data != null){
                $accountId = $retour->data;

                $params = new stdClass();
                $params->value = $retour->data;
                $this->addDataStr($params);

                $params = new OdaPrepareReqSql();
                $params->sql = "INSERT INTO  `tab_accounts_items` (
                        `code` ,
                        `label`,
                        `salesForce`,
                        `userId`,
                        `statusId`,
                        `accountId`
                    )
                    VALUES (
                        'default', 'account.item-default', '', :userId, 2, :accountId
                    )
                ;";
                $params->bindsValue = [
                    "userId" => $this->inputs["userId"],
                    "accountId" => $accountId
                ];
                $params->typeSQL = OdaLibBd::SQL_INSERT_ONE;
                $retour = $this->BD_ENGINE->reqODASQL($params);
            }else{
                $this->dieInError("code already use");
            }
        } catch (Exception $ex) {
            $this->object_retour->strErreur = $ex.'';
            $this->object_retour->statut = self::STATE_ERROR;
            die();
        }
    }
    /**
     */
    function createItem() {
        try {
            $params = new OdaPrepareReqSql();
            $params->sql = "INSERT INTO  `tab_accounts_items` (
                    `code` ,
                    `label`,
                    `salesForce`,
                    `userId`,
                    `statusId`,
                    `accountId`,
                    `charge`
                )
                VALUES (
                    :code, :label, :salesForce, :userId, 2, :accountId, :charge
                )
            ;";
            $params->bindsValue = [
                "code" => $this->inputs["code"],
                "label" => $this->inputs["label"],
                "salesForce" => $this->inputs["salesForce"],
                "userId" => $this->inputs["userId"],
                "accountId" => $this->inputs["accountId"],
                "charge" => $this->inputs["charge"]
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
     */
    function getFull() {
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

            foreach($retour->data->data as $value) {
                $params = new OdaPrepareReqSql();
                $params->sql = "SELECT a.`id`, a.`code`, a.`label`, a.`salesForce`,
                    a.`statusId`, b.`label` as  'statusLabel', b.`active` as 'statusActive',
                    a.`accountId`
                    FROM `tab_accounts_items` a, `tab_accounts_items_status` b
                    WHERE 1=1
                    AND a.`statusId` = b.`id`
                    AND a.`accountId` = :accountId
                ;";
                $params->typeSQL = OdaLibBd::SQL_GET_ALL;
                $params->bindsValue = [
                    "accountId" => $value->id
                ];
                $retourItems = $this->BD_ENGINE->reqODASQL($params);
                $value->items = $retourItems->data->data;
            }

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
    function getItem() {
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
     * @param $accountId
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