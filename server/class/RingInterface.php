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
    
    public $odaOffset;
    
    public $odaLimit;

    public $slim;
    
    public function __construct($params) {

        $this->slim = $params->slim;

        $this->odaOffset = $params->slim->request->params('odaOffset');
        if(is_null($this->odaOffset)){
            $this->odaOffset = 0;
        }else{
            $this->odaOffset = intval($this->odaOffset);
        }
        $this->odaLimit = $params->slim->request->params('odaLimit');
        if(is_null($this->odaLimit)){
            $this->odaLimit = 9999;
        }else{
            $this->odaLimit = intval($this->odaLimit);
        }
        
        parent::__construct($params);
    }
}