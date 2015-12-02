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
            }
        }
    };

    // Initialize
    _init();

})();
