# Routes

## config

* `/config/search/user/:id`
    * type : GET
 
## event

* `/event/`
    * type : GET
* `/event/`
    * type : POST
    * mandatory params : "title","start","end","tmp","allDay","autorId","type", "time", "cmt","billable","synchGoogle","synchSF"
    * public : false
* `/event/:id`
    * type : GET
* `/event/:id`
    * type : PUT
    * mandatory params : "title","start","end","tmp","allDay","type", "time", "cmt", "billable","synchGoogle","synchSF"
    * public : false
* `/event/:id`
    * type : DELETE
    * public : false
* `/event/:id/googleCalendar/`
    * type : PUT
    * mandatory params : "googleEtag","googleId","googleHtmlLink","googleICalUID"
    * public : false
* `/event/type/`
    * type : GET
* `/event/location/`
    * type : GET
* `/event/search/user/:id`
    * type : GET
    
## account

* `/account/`
    * type : GET
    * optional params : "withItem","mode"
* `/account/`
    * type : POST
    * mandatory params : "code","label","salesForce","userId"
    * public : false
* `/account/item/`
    * type : GET
    * optional params : "withItem","mode"
* `/account/item/`
    * type : POST
    * mandatory params : "code","label","salesForce","userId","accountId","charge"
    * public : false
* `/account/:id/search/item`
     * type : GET

## rapport

* `/rapport/event/client/`
    * type : GET
    * optional params : "accountId","billable"
* `/rapport/event/type/`
    * type : GET
    * optional params : "userId"
* `/rapport/event/location/`
    * type : GET
    * optional params : "userId" 

    

