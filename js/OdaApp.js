/* global er */
//# sourceURL=OdaApp.js
// Library of tools for the exemple
/**
 * @author FRO
 * @date 15/05/08
 */

(function() {
    'use strict';

    var
        /* version */
        VERSION = '0.1'
    ;
    
    ////////////////////////// PRIVATE METHODS ////////////////////////
    /**
     * @name _init
     * @desc Initialize
     */
    function _init() {
        $.Oda.Event.addListener({name : "oda-fully-loaded", callback : function(e){
            $.Oda.App.startApp();
        }});
    }

    ////////////////////////// PUBLIC METHODS /////////////////////////
    $.Oda.App = {
        /* Version number */
        version: VERSION,
        
        /**
         * @returns {$.Oda.App}
         */
        startApp: function () {
            try {
                $.Oda.Router.addDependencies("fullcalendar", {
                    ordered : false,
                    "list" : [
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar/dist/fullcalendar.min.css", "type" : "css"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/moment/min/moment.min.js", "type" : "script"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar/dist/fullcalendar.min.js", "type" : "script"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar/dist/lang/fr.js", "type" : "script"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar/dist/lang/es.js", "type" : "script"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar/dist/lang/it.js", "type" : "script"}
                    ]
                });

                $.Oda.Router.addRoute("home", {
                    "path" : "partials/home.html",
                    "title" : "oda-main.home-title",
                    "urls" : ["","home"],
                    "middleWares":["support","auth"]
                });

                $.Oda.Router.addRoute("activity", {
                    "path" : "partials/activity.html",
                    "title" : "activity.title",
                    "urls" : ["activity"],
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["fullcalendar"]
                });

                $.Oda.Router.startRooter();

                return this;
            } catch (er) {
                $.Oda.Log.error("$.Oda.App.startApp : " + er.message);
                return null;
            }
        },

        "Controler" : {
            "Activity" : {
                "dayClickData" : null,
                "activityTypes" : null,
                /**
                 */
                start: function () {
                    try {
                        $.Oda.App.Controler.Activity.sessionGoogleStart();

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/type/", {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.activityTypes = response.data;
                            $.Oda.App.Controler.Activity.buildLegend();
                        }});

                        $('#calendar').fullCalendar({
                            lang: 'fr',
                            weekNumbers : true,
                            dayClick: function(date, jsEvent, view) {
                                $.Oda.App.Controler.Activity.dayClickData = {"date":date, "jsEvent":jsEvent, "view":view, "cell" : $(this)}
                                $.Oda.App.Controler.Activity.createEvent();
                            },
                            events: function(start, end, timezone, callback) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/userId/"+ $.Oda.Session.id, {functionRetour : function(response){
                                    for(var index in response.data){
                                        var elt = response.data[index];
                                        if(elt.tmp === "1"){
                                            elt.className += "-stripe";
                                        }
                                    }
                                    callback(response.data);
                                }});
                            },
                            eventClick: function(calEvent, jsEvent, view) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/"+ calEvent.id, {functionRetour : function(response){

                                    var testHours = (response.data.end !== "0000-00-00 00:00:00");
                                    var date = response.data.start.substr(0,10);

                                    function getStrHtmlHours(timeSelected){
                                        var strHtmlHours = "";
                                        for (var iter = 0; iter < 24; iter++) {
                                            var time = $.Oda.Tooling.pad2(iter)+':00';
                                            strHtmlHours += '<option value="'+ time +'" '+ ((testHours && timeSelected.indexOf(time)>0)?'selected':'') +'>'+ time +'</option>';
                                            var time = $.Oda.Tooling.pad2(iter)+':30';
                                            strHtmlHours += '<option value="'+ time +'" '+ ((testHours && timeSelected.indexOf(time)>0)?'selected':'') +'>'+ time +'</option>';
                                        }
                                        return strHtmlHours;
                                    }

                                    var strHtmlTypes = "";
                                    for(var index in $.Oda.App.Controler.Activity.activityTypes){
                                        var elt = $.Oda.App.Controler.Activity.activityTypes[index];
                                        var label = $.Oda.I8n.getByString(elt.label);
                                        strHtmlTypes += '<option value="'+ elt.id +'" '+ ((response.data.typeId === elt.id)?'selected':'') +'>'+ label + '</option>';
                                    }

                                    var strHtml = $.Oda.Display.TemplateHtml.create({
                                        template : "formEditEvent"
                                        , scope : {
                                            "title" : response.data.title,
                                            "allDay" : (response.data.allDay === "1")?"checked":"",
                                            "tmp" : (response.data.tmp === "1")?"checked":"",
                                            "valuesHoursStart" : getStrHtmlHours(response.data.start),
                                            "valuesHoursEnd" : getStrHtmlHours(response.data.end),
                                            "types" : strHtmlTypes,
                                            "time" : response.data.time,
                                            "cmt" : response.data.cmt,
                                            "billable" : (response.data.billable === "1")?"checked":"",
                                            "synchGoogle" : (response.data.synGoogle === "1")?"checked":"",
                                            "synchSF" : (response.data.synSF === "1")?"checked":"",
                                        }
                                    });

                                    $.Oda.Display.Popup.open({
                                        "name" : "editEvent",
                                        "label" : $.Oda.I8n.get('activity','editEvent'),
                                        "details" : strHtml,
                                        "footer" : '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.Activity.submitEditEvent({id:'+response.data.id+', date:\''+date+'\'});" class="btn btn-primary disabled" disabled>Submit</button >',
                                        "callback" : function(){
                                            $.Oda.Scope.Gardian.add({
                                                id : "editEvent",
                                                listElt : ["title", "allDay", "type", "start", "end", "tmp", "time", "cmt"],
                                                function : function(e){
                                                    if($("#allDay").prop("checked")){
                                                        $('#start').addClass("disabled");
                                                        $('#start').attr("disabled", true);
                                                        $('#end').addClass("disabled");
                                                        $('#end').attr("disabled", true);
                                                    }else {
                                                        $('#start').removeClass("disabled");
                                                        $('#start').removeAttr("disabled", true);
                                                        $('#end').removeClass("disabled");
                                                        $('#end').removeAttr("disabled", true);
                                                    }

                                                    if($("#allDay").prop("checked")){
                                                        if( ($("#title").data("isOk")) && ($("#type").data("isOk")) && ($("#time").data("isOk")) && ($("#cmt").data("isOk")) ){
                                                            $("#submit").removeClass("disabled");
                                                            $("#submit").removeAttr("disabled");
                                                        }else{
                                                            $("#submit").addClass("disabled");
                                                            $("#submit").attr("disabled", true);
                                                        }
                                                    }else{
                                                        if( ($("#title").data("isOk")) && ($("#start").data("isOk")) && ($("#end").data("isOk")) && ($("#start").val() !== $("#end").val()) && ($("#type").data("isOk")) && ($("#time").data("isOk")) && ($("#cmt").data("isOk")) ){
                                                            $("#submit").removeClass("disabled");
                                                            $("#submit").removeAttr("disabled");
                                                        }else{
                                                            $("#submit").addClass("disabled");
                                                            $("#submit").attr("disabled", true);
                                                        }
                                                    }

                                                    if ( (!$("#allDay").prop("checked")) && ($("#start").data("isOk")) && ($("#end").data("isOk")) && ($("#start").val() === $("#end").val())){
                                                        $.Oda.Display.Notification.warning($.Oda.I8n.get('activity','conflictHours'));
                                                    }
                                                }
                                            });
                                            $.Oda.Scope.Gardian.inventory.editEvent.function();
                                        }
                                    });
                                }});
                            }
                        })
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.start : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                createEvent: function () {
                    try {
                        var strHtmlHours = "";
                        for (var iter = 0; iter < 24; iter++) {
                            strHtmlHours += '<option value="'+ $.Oda.Tooling.pad2(iter)+':00">'+ $.Oda.Tooling.pad2(iter)+':00</option>';
                            strHtmlHours += '<option value="'+ $.Oda.Tooling.pad2(iter)+':30">'+ $.Oda.Tooling.pad2(iter)+':30</option>';
                        }

                        var strHtmlTypes = "";
                        for(var index in $.Oda.App.Controler.Activity.activityTypes){
                            var elt = $.Oda.App.Controler.Activity.activityTypes[index];
                            if(elt.active === "1"){
                                var label = $.Oda.I8n.getByString(elt.label);
                                strHtmlTypes += '<option value="'+ elt.id +'">'+ label + '</option>';
                            }
                        }

                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "formCreateEvent"
                            , scope : {
                                "valuesHours" : strHtmlHours,
                                "types" : strHtmlTypes
                            }
                        });

                        $.Oda.Display.Popup.open({
                            "name" : "createEvent",
                            "label" : $.Oda.I8n.get('activity','createEvent') + ', ' + $.Oda.App.Controler.Activity.dayClickData.date.format(),
                            "details" : strHtml,
                            "footer" : '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.Activity.submitNewActivity();" class="btn btn-primary disabled" disabled>Submit</button >',
                            "callback" : function(){
                                $.Oda.Scope.Gardian.add({
                                    id : "createEvent",
                                    listElt : ["title", "allDay", "type", "start", "end", "tmp", "time", "cmt"],
                                    function : function(e){
                                        if($("#allDay").prop("checked")){
                                            $('#start').addClass("disabled");
                                            $('#start').attr("disabled", true);
                                            $('#end').addClass("disabled");
                                            $('#end').attr("disabled", true);
                                        }else {
                                            $('#start').removeClass("disabled");
                                            $('#start').removeAttr("disabled", true);
                                            $('#end').removeClass("disabled");
                                            $('#end').removeAttr("disabled", true);
                                        }

                                        if($("#allDay").prop("checked")){
                                            if( ($("#title").data("isOk")) && ($("#type").data("isOk")) && ($("#time").data("isOk")) && ($("#cmt").data("isOk")) ){
                                                $("#submit").removeClass("disabled");
                                                $("#submit").removeAttr("disabled");
                                            }else{
                                                $("#submit").addClass("disabled");
                                                $("#submit").attr("disabled", true);
                                            }
                                        }else{
                                            if( ($("#title").data("isOk")) && ($("#start").data("isOk")) && ($("#end").data("isOk")) && ($("#start").val() !== $("#end").val()) && ($("#type").data("isOk")) && ($("#time").data("isOk")) && ($("#cmt").data("isOk")) ){
                                                $("#submit").removeClass("disabled");
                                                $("#submit").removeAttr("disabled");
                                            }else{
                                                $("#submit").addClass("disabled");
                                                $("#submit").attr("disabled", true);
                                            }
                                        }

                                        if ( (!$("#allDay").prop("checked")) && ($("#start").data("isOk")) && ($("#end").data("isOk")) && ($("#start").val() === $("#end").val())){
                                            $.Oda.Display.Notification.warning($.Oda.I8n.get('activity','conflictHours'));
                                        }
                                    }
                                });
                            }
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.createEvent : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                submitNewActivity: function () {
                    try {
                        var start = $.Oda.App.Controler.Activity.dayClickData.date.format();
                        var end = null;
                        var allDay = $('#allDay');
                        if(!allDay.prop("checked")){
                            start +=  " " +  $("#start").val() +  ":00";
                            end = $.Oda.App.Controler.Activity.dayClickData.date.format() + " " +  $("#end").val() +  ":00";
                        }

                        var tabInput = {
                            "title" : $('#title').val(),
                            "allDay" : (allDay.prop("checked"))?1:0,
                            "start" : start,
                            "end" : end,
                            "type" : $('#type').val(),
                            "tmp" : ($('#tmp').prop("checked"))?1:0,
                            "time" : $('#time').val(),
                            "cmt" : $('#cmt').val(),
                            "billable" : ($('#billable').prop("checked"))?1:0,
                            "synchGoogle" : ($('#synchGoogle').prop("checked"))?1:0,
                            "synchSF" : ($('#synchSF').prop("checked"))?1:0,
                            "autorId" : $.Oda.Session.id
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/activityNew.php", {functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"createEvent"});
                            $('#calendar').fullCalendar( 'refetchEvents' );
                        }},tabInput);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.submitNewActivity : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {object} p_params
                 * @param p_params.id
                 * @param p_params.date
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                submitEditEvent: function (p_params) {
                    try {
                        var start = p_params.date;
                        var end = null;
                        var allDay = $('#allDay');
                        if(!allDay.prop("checked")){
                            start +=  " " +  $("#start").val() +  ":00";
                            end = p_params.date + " " +  $("#end").val() +  ":00";
                        }

                        var tabInput = {
                            "title" : $('#title').val(),
                            "allDay" : (allDay.prop("checked"))?1:0,
                            "start" : start,
                            "end" : end,
                            "type" : $('#type').val(),
                            "tmp" : ($('#tmp').prop("checked"))?1:0,
                            "time" : $('#time').val(),
                            "cmt" : $('#cmt').val(),
                            "billable" : ($('#billable').prop("checked"))?1:0,
                            "synchGoogle" : ($('#synchGoogle').prop("checked"))?1:0,
                            "synchSF" : ($('#synchSF').prop("checked"))?1:0,
                            "id" : p_params.id
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/activityUpdate.php", {functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"editEvent"});
                            $('#calendar').fullCalendar( 'refetchEvents' );
                        }},tabInput);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.submitEditEvent : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                buildLegend: function () {
                    try {
                        var strHtml = "";
                        for(var index in $.Oda.App.Controler.Activity.activityTypes){
                            var elt = $.Oda.App.Controler.Activity.activityTypes[index];
                            strHtml += $.Oda.Display.TemplateHtml.create({
                                template : "templateLegend"
                                , scope : {
                                    "label" : $.Oda.I8n.getByString(elt.label),
                                    "illusStable" : elt.className,
                                    "illusNoStable" : elt.className+"-stripe"
                                }
                            });
                        }
                        $('#legend').html(strHtml);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.buildLegend : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                displayLegend : function () {
                    try {
                        var div = $('#legend');
                        if(div.hasClass('legendShow')){
                            div.removeClass('legendShow');
                        }else{
                            div.addClass('legendShow');
                        }
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.displayLegend : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                sessionGoogleStart: function () {
                    try {
                        $.Oda.Google.scopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
                        $.Oda.Google.apiKey = "E5mFPaRktLAbgiS_x1Bto6wT";
                        $.Oda.Google.clientId = "903695174254-gui9k14l6b8i81jvpmu5s8eu68tti2d8.apps.googleusercontent.com";
                        $.Oda.Google.ready = false;
                        $.Oda.Google.startSessionAuth(
                            function(){
                                $.Oda.App.Controler.Activity.returnGoogleSession();
                            }
                            , function(){
                                $('#google').html('<button type="button" onclick="$.Oda.Google.callServiceGoogleAuth($.Oda.App.Controler.Activity.returnGoogleSession);" class="btn btn-danger center-block">'+$.Oda.I8n.get("oda-main","bt-google")+'</button>');
                            }
                        );
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.sessionGoogleStart : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                returnGoogleSession: function () {
                    try {
                        gapi.client.setApiKey("");
                        $.Oda.Google.loadGapis([{
                            "api": "calendar",
                            "version": "v3"
                        }], function(){
                            $.Oda.Google.ready = true;
                            $.Oda.Google.gapi.client.oauth2.userinfo.get().execute(function(resp) {
                                $('#google').html('Logger pour Google avec '+resp.email);
                            });
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.returnGoogleSession : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {object} p_params
                 * @param p_params.id
                 * @returns {String}
                 */
                newEventGoogleCalendar: function (p_params) {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/"+ p_params.id, {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.createAppointment(response.data);
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.newEventGoogleCalendar : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {object} p_params
                 * @param p_params.id
                 * @returns {String}
                 */
                getDateGoole : function(p_date) {
                    try{
                        //13-03-15 13:00
                        //2015-03-01T10:00:00.000+01:00
                        var array0 = p_date.split(" ");
                        var arrayDate = array0[0].split("-");
                        var strDateGoole = "20"+arrayDate[2]+"-"+arrayDate[1]+"-"+arrayDate[0]+"T"+array0[1]+":00.000+01:00";
                        return strDateGoole;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.getDateGoole :" + er.message);
                        return null;
                    }
                },
                /**
                 * @param {object} p_params
                 * @returns {String}
                 */
                createAppointment : function(p_params){
                    try{
                        var summary = this.generateTitleGoogleCalendar(p_params);

                        var start = {
                            "timeZone" : "Europe/Paris"
                        };
                        var end = {
                            "timeZone" : "Europe/Paris"
                        };
                        if(p_params.allDay === "1"){
                            start.date = p_params.start.substr(0,10);
                            var tmp_end = moment(p_params.start).add(1,'days');
                            end.date = tmp_end.format('YYYY-MM-DD');
                        }else{
                            start.dateTime = this.getDateGoole(p_params.start);
                            end.dateTime = this.getDateGoole(p_params.end);
                        }

                        var resource = {
                            "summary": summary,
                            "location": "loc",
                            "description": "cmt",
                            "start": start,
                            "end": end,
                            "source": {
                                "url": "https://consultant.cloud.bonitasoft.com/bonita/",
                                "title": "Clound Consultant Form Activity"
                            }
                        };

                        $.Oda.Log.trace(resource);

                        var request = $.Oda.Google.gapi.client.calendar.events.insert({
                            'calendarId': 'primary',
                            'resource': resource
                        });

                        request.execute(function(resp) {
                            if(resp.status == "confirmed"){
                                $.Oda.Log.trace("ok !");
                                $.Oda.Log.trace(resp);
                            }else{
                                $.Oda.Log.trace("ko !");
                                $.Oda.Log.trace(resp);
                            }
                        });
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity..createAppointment :" + er.message);
                    }
                },
                /**
                 * @param {object} p_params
                 * @returns {String}
                 */
                generateTitleGoogleCalendar: function (p_params) {
                    try {
                        var type = "";
                        for(var index in $.Oda.App.Controler.Activity.activityTypes){
                            if(p_params.typeId === $.Oda.App.Controler.Activity.activityTypes[index].id){
                                type = $.Oda.App.Controler.Activity.activityTypes[index].code;
                                break;
                            }
                        }
                        var str = "[" + type + "] - [" + p_params.title + "] - [" + p_params.time + "H] - [" + ((p_params.billable === "1")?"a0jD":"free") + "] - [" + $.Oda.Session.code_user + "]";
                        return str;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.generateTitleGoogleCalendar : " + er.message);
                        return null;
                    }
                },
            }
        }
    };

    // Initialize
    _init();

})();
