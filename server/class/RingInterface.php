<?php
namespace Ring;

use \stdClass, \Oda\OdaLibInterface;

/**
 * Project class
 *
 * Tool
 *
 * @author  Fabrice Rosito <rosito.fabrice@gmail.com>
 * @version 0.150221
 */
class RingInterface extends OdaLibInterface {
    /**
     * sayHello
     * @return string
     */
    static function sayHello() {
        try {
            return "hello";
        } catch (Exception $ex) {
            return null;
        }
    }
}