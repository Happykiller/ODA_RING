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
class ConfigInterface extends OdaRestInterface {
    /**
     * @param $userId
     */
    function getByUser($userId) {
        try {
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