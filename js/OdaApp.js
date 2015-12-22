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

                $.Oda.Router.addDependencies("moment", {
                    ordered : false,
                    "list" : [
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/moment/min/moment.min.js", "type" : "script"}
                    ]
                });

                $.Oda.Router.addDependencies("gantt", {
                    ordered : false,
                    "list" : [
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar-scheduler/dist/scheduler.min.css", "type" : "css"},
                        { "elt" : $.Oda.Context.rootPath + $.Oda.Context.vendorName + "/fullcalendar-scheduler/dist/scheduler.min.js", "type" : "script"}
                    ]
                });

                $.Oda.Router.addRoute("home", {
                    "path" : "partials/home.html",
                    "title" : "oda-main.home-title",
                    "urls" : ["","home"],
                    "middleWares":["support","auth"],
                    "dependencies" : ["hightcharts"]
                });

                $.Oda.Router.addRoute("activity", {
                    "path" : "partials/activity.html",
                    "title" : "activity.title",
                    "urls" : ["activity"],
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["fullcalendar"]
                });

                $.Oda.Router.addRoute("activity-list", {
                    "path" : "partials/activity-list.html",
                    "title" : "activity-list.title",
                    "urls" : ["activity-list"],
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["fullcalendar","gantt"]
                });

                $.Oda.Router.addRoute("activity-rapport-client", {
                    "path" : "partials/activity-rapport-client.html",
                    "title" : "activity-rapport-client.title",
                    "urls" : ["activity-rapport-client"],
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["moment"]
                });

                $.Oda.Router.addRoute("manage-accounts", {
                    "path" : "partials/manage-accounts.html",
                    "title" : "manage-accounts.title",
                    "urls" : ["manage-accounts"],
                    "middleWares" : ["support","auth"],
                    "dependencies" : ["dataTables"]
                });

                $.Oda.Router.startRooter();

                return this;
            } catch (er) {
                $.Oda.Log.error("$.Oda.App.startApp : " + er.message);
                return null;
            }
        },

        "Controler" : {
            "config" : {
                "activityGoogleCalendar" : "primary"
            },
            "Home" : {
                /**
                 */
                start: function () {
                    try {
                        var tabInput = {
                            "userId" : $.Oda.Session.id
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/rapport/event/type/", { functionRetour : function(response){
                            var datas = [];

                            for(var indice in response.data.data){
                                var elt = response.data.data[indice];
                                var data = {
                                    "name": $.Oda.I8n.getByString(elt.label),
                                    "y": parseInt(elt.sumTime)
                                };
                                datas.push(data);
                            }

                            $('#pieEventByType').highcharts({
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    type: 'pie'
                                },
                                title: {
                                    text: $.Oda.I8n.get("home","pieEventByType")
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        }
                                    }
                                },
                                series: [{
                                    name: "Type",
                                    colorByPoint: true,
                                    data: datas
                                }]
                            });
                        }},tabInput);

                        var tabInput = {
                            "userId" : $.Oda.Session.id
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/rapport/event/location/", { functionRetour : function(response){
                            var datas = [];

                            for(var indice in response.data.data){
                                var elt = response.data.data[indice];
                                var data = {
                                    "name": $.Oda.I8n.getByString(elt.label),
                                    "y": parseInt(elt.sumTime)
                                };
                                datas.push(data);
                            }

                            $('#pieEventByLocation').highcharts({
                                chart: {
                                    plotBackgroundColor: null,
                                    plotBorderWidth: null,
                                    plotShadow: false,
                                    type: 'pie'
                                },
                                title: {
                                    text: $.Oda.I8n.get("home","pieEventByLocation")
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                            style: {
                                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                            }
                                        }
                                    }
                                },
                                series: [{
                                    name: "Location",
                                    colorByPoint: true,
                                    data: datas
                                }]
                            });
                        }},tabInput);
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Home.start : " + er.message);
                        return null;
                    }
                },
            },
            "Activity" : {
                "dayClickData" : null,
                "activityTypes" : null,
                "activityLocation" : null,
                "accounts": null,
                "items": null,
                "templateCalendar" : '[type][account][item][title][time][billable][code_user]<-tmp>',
                /**
                 */
                start: function () {
                    try {
                        $.Oda.App.Controler.Activity.sessionGoogleStart();

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/config/search/user/"+ $.Oda.Session.id, {functionRetour : function(response){
                            if(response.data){
                                $.Oda.App.Controler.config = response.data;
                            }
                        }});

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/location/", {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.activityLocation = response.data;
                        }});

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/type/", {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.activityTypes = response.data;
                            $.Oda.App.Controler.Activity.buildLegend();
                        }});

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/", {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.accounts = response.data;
                        }});

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/item/", {functionRetour : function(response){
                            $.Oda.App.Controler.Activity.items = response.data;
                        }});

                        $('#calendar').fullCalendar({
                            lang: 'fr',
                            weekNumbers : true,
                            dayClick: function(date, jsEvent, view) {
                                $.Oda.App.Controler.Activity.dayClickData = {"date":date, "jsEvent":jsEvent, "view":view, "cell" : $(this)}
                                $.Oda.App.Controler.Activity.createEvent();
                            },
                            events: function(start, end, timezone, callback) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/search/user/"+ $.Oda.Session.id, {functionRetour : function(response){
                                    for(var index in response.data){
                                        var elt = response.data[index];
                                        elt.title = elt.time + ': ' + elt.title;
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

                                    var locations = "";
                                    for(var index in $.Oda.App.Controler.Activity.activityLocation){
                                        var elt = $.Oda.App.Controler.Activity.activityLocation[index];
                                        if(elt.active === "1"){
                                            var label = $.Oda.I8n.getByString(elt.label);
                                            locations += '<option value="'+ elt.id +'" '+ ((response.data.locationId === elt.id)?'selected':'') +'>'+ label + '</option>';
                                        }
                                    }

                                    var accounts = "";
                                    for(var index in $.Oda.App.Controler.Activity.accounts){
                                        var elt = $.Oda.App.Controler.Activity.accounts[index];
                                        if(elt.statusId !== "3"){
                                            var label = $.Oda.I8n.getByString(elt.label);
                                            accounts += '<option value="'+ elt.id +'"'+ ((response.data.accountId === elt.id)?'selected':'') +'>'+ label + '</option>';
                                        }
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
                                            "locations" : locations,
                                            "time" : response.data.time,
                                            "cmt" : response.data.cmt,
                                            "billable" : (response.data.billable === "1")?"checked":"",
                                            "synchGoogle" : (response.data.synGoogle === "1")?"checked":"",
                                            "synchSF" : (response.data.synSF === "1")?"checked":"",
                                            "accounts": accounts,
                                            "items" : ""
                                        }
                                    });

                                    var strFooter = "";
                                    strFooter += '<button type="button" oda-label="oda-main.bt-delete" oda-submit="delete" onclick="$.Oda.App.Controler.Activity.deleteEvent({id:'+response.data.id+', googleId:\''+response.data.googleId+'\'});" class="btn btn-danger pull-left">oda-main.bt-delete</button >';
                                    strFooter += '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.Activity.submitEditEvent({id:'+response.data.id+', date:\''+date+'\', googleId:\''+response.data.googleId+'\'});" class="btn btn-primary disabled" disabled>Submit</button >';

                                    $.Oda.Display.Popup.open({
                                        "name" : "editEvent",
                                        "size" : "lg",
                                        "label" : $.Oda.I8n.get('activity','editEvent'),
                                        "details" : strHtml,
                                        "footer" : strFooter,
                                        "callback" : function(e){

                                            $.Oda.App.Controler.Activity.getHtmlSelectItems({id:$('#account').val(), itemId : response.data.itemId });

                                            $.Oda.Scope.Gardian.add({
                                                id: "accountItem",
                                                listElt: ["account"],
                                                function: function (e) {
                                                    $.Oda.App.Controler.Activity.getHtmlSelectItems({id:$('#account').val()});
                                                }
                                            });

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

                        var locations = "";
                        for(var index in $.Oda.App.Controler.Activity.activityLocation){
                            var elt = $.Oda.App.Controler.Activity.activityLocation[index];
                            if(elt.active === "1"){
                                var label = $.Oda.I8n.getByString(elt.label);
                                locations += '<option value="'+ elt.id +'">'+ label + '</option>';
                            }
                        }

                        var accounts = "";
                        for(var index in $.Oda.App.Controler.Activity.accounts){
                            var elt = $.Oda.App.Controler.Activity.accounts[index];
                            if(elt.statusId !== "3"){
                                var label = $.Oda.I8n.getByString(elt.label);
                                accounts += '<option value="'+ elt.id +'">'+ label + '</option>';
                            }
                        }

                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "formCreateEvent"
                            , scope : {
                                "valuesHours" : strHtmlHours,
                                "types" : strHtmlTypes,
                                "locations" : locations,
                                "accounts": accounts,
                                "items" : ""
                            }
                        });

                        $.Oda.Display.Popup.open({
                            "name" : "createEvent",
                            "size" : "lg",
                            "label" : $.Oda.I8n.get('activity','createEvent') + ', ' + $.Oda.App.Controler.Activity.dayClickData.date.format(),
                            "details" : strHtml,
                            "footer" : '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.Activity.submitNewActivity();" class="btn btn-primary disabled" disabled>Submit</button >',
                            "callback" : function(){
                                $.Oda.Scope.Gardian.add({
                                    id: "accountItem",
                                    listElt: ["account"],
                                    function: function (e) {
                                        $.Oda.App.Controler.Activity.getHtmlSelectItems({id:$('#account').val()});
                                    }
                                });

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
                            "locationId" : $('#location').val(),
                            "billable" : ($('#billable').prop("checked"))?1:0,
                            "synchGoogle" : ($('#synchGoogle').prop("checked"))?1:0,
                            "synchSF" : ($('#synchSF').prop("checked"))?1:0,
                            "autorId" : $.Oda.Session.id,
                            "itemId" : ($('#item').val() !== null)?$('#item').val():1
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/", {type:'POST',functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"createEvent"});
                            $('#calendar').fullCalendar( 'refetchEvents' );
                            $.Oda.App.Controler.Activity.newEventGoogleCalendar({id:response.data});
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
                            "locationId" : $('#location').val(),
                            "billable" : ($('#billable').prop("checked"))?1:0,
                            "synchGoogle" : ($('#synchGoogle').prop("checked"))?1:0,
                            "synchSF" : ($('#synchSF').prop("checked"))?1:0,
                            "itemId" : ($('#item').val() !== null)?$('#item').val():1
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/"+p_params.id, { type : 'PUT', functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"editEvent"});
                            $('#calendar').fullCalendar( 'refetchEvents' );
                            if(p_params.googleId !== ""){
                                $.Oda.App.Controler.Activity.updateEventGoogleCalendar({id:p_params.id});
                            }else{
                                $.Oda.App.Controler.Activity.newEventGoogleCalendar({id:p_params.id});
                            }
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
                        $.Oda.Google.ready = false;
                        $.Oda.Google.startSessionAuth(
                            function(){
                                $.Oda.App.Controler.Activity.returnGoogleSession();
                            }
                            , function(){
                                $('#google').html('<button type="button" onclick="$.Oda.Google.callServiceGoogleAuth($.Oda.App.Controler.Activity.returnGoogleSession);" class="btn btn-danger center-block">'+$.Oda.I8n.get("activity","syn-google")+'</button>');
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
                                $('#google').html($.Oda.I8n.get("activity","googleLogWith") + resp.email);
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
                            if((response.data.synGoogle === "1")&&($.Oda.Google.ready)){
                                $.Oda.App.Controler.Activity.createAppointment(response.data);
                            }
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
                updateEventGoogleCalendar: function (p_params) {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/"+ p_params.id, {functionRetour : function(response){
                            if((response.data.googleId !== "")&&(response.data.synGoogle === "1")&&($.Oda.Google.ready)){
                                $.Oda.App.Controler.Activity.updateAppointment(response.data);
                            }
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.updateEventGoogleCalendar : " + er.message);
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
                        //2015-12-03 05:00:00
                        //2015-12-03T05:00:00.000
                        var array0 = p_date.split(" ");
                        var arrayDate = array0[0].split("-");
                        var strDateGoole = +arrayDate[0]+"-"+arrayDate[1]+"-"+arrayDate[2]+"T"+array0[1]+".000";
                        return strDateGoole;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.getDateGoole :" + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                updateAppointment : function (p_params) {
                    try {
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
                            "description": p_params.cmt + "\n \n Last update : " + $.Oda.Date.getStrDateTime() + "\n \n Template title : " + $.Oda.App.Controler.Activity.templateCalendar,
                            "start": start,
                            "end": end
                        };

                        var request = $.Oda.Google.gapi.client.calendar.events.update({
                            'calendarId': $.Oda.App.Controler.config.activityGoogleCalendar,
                            'eventId' : p_params.googleId,
                            'resource': resource
                        });

                        request.execute(function(resp) {
                            if(resp.status === "confirmed"){
                                $.Oda.Display.Notification.info($.Oda.I8n.get('activity','okUpdateAppointmentGoogle'));
                            }else{
                                $.Oda.Display.Notification.error($.Oda.I8n.get('activity','errorUpdateAppointmentGoogle') + " => " + resp.message);
                                $.Oda.Log.error(resp);
                            }
                        });

                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.updateAppointment : " + er.message);
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
                            "description": p_params.cmt + "\n \n Template title : " + $.Oda.App.Controler.Activity.templateCalendar,
                            "start": start,
                            "end": end,
                            "source": {
                                "url": "http://pro-happykiller.rhcloud.com/RING/",
                                "title": "Oda Ring"
                            }
                        };

                        var request = $.Oda.Google.gapi.client.calendar.events.insert({
                            'calendarId': $.Oda.App.Controler.config.activityGoogleCalendar,
                            'resource': resource
                        });

                        request.execute(function(resp) {
                            if(resp.status === "confirmed"){
                                var datas = {
                                    "googleEtag" : $.Oda.Tooling.replaceAll({str:resp.etag,find:'"',by:''}),
                                    "googleId" : resp.id,
                                    "googleHtmlLink" : resp.htmlLink,
                                    "googleICalUID" : resp.iCalUID
                                };
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/"+p_params.id+"/googleCalendar/", { type : 'PUT', functionRetour : function(response){
                                    $.Oda.Display.Notification.info($.Oda.I8n.get('activity','okCreateAppointmentGoogle'));
                                }},datas);
                            }else{
                                $.Oda.Display.Notification.error($.Oda.I8n.get('activity','errorCreateAppointmentGoogle') + " => " + resp.message);
                                $.Oda.Log.error(resp);
                            }
                        });
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity..createAppointment :" + er.message);
                    }
                },
                /**
                 * @param {object} p_params
                 * @returns {String} [type][account][item][title][time][billable][code_user]<-tmp>
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

                        var account = "none";
                        for(var index in $.Oda.App.Controler.Activity.accounts){
                            var elt = $.Oda.App.Controler.Activity.accounts[index];
                            if(elt.id === p_params.accountId){
                                account = $.Oda.App.Controler.Activity.accounts[index].code;
                                break;
                            }
                        }

                        var item = "none";
                        for(var index in $.Oda.App.Controler.Activity.items){
                            var elt = $.Oda.App.Controler.Activity.items[index];
                            if(elt.id === p_params.itemId){
                                item = $.Oda.App.Controler.Activity.items[index].code;
                                break;
                            }
                        }

                        var str = "[" + type.toUpperCase() + "][" + account + "][" + item + "][" + p_params.title + "][" + p_params.time + "H][" + ((p_params.billable === "1")?"a0jD":"free") + "][" + $.Oda.Session.code_user.toUpperCase() + "]" + ((p_params.tmp === "1")?"-TMP":"");
                        return str;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.generateTitleGoogleCalendar : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @param p_params.googleId
                 * @returns {$.Oda.App.Controler.Activity}
                 */
                deleteEvent : function (p_params) {
                    try {
                        if((p_params.googleId !== "")&&($.Oda.Google.ready)) {
                            var request = $.Oda.Google.gapi.client.calendar.events.delete({
                                'calendarId': $.Oda.App.Controler.config.activityGoogleCalendar,
                                'eventId': p_params.googleId
                            });

                            request.execute(function (resp) {
                                if ((resp.message === undefined)||(resp.message === "")) {
                                    $.Oda.Display.Notification.info($.Oda.I8n.get('activity', 'okDeleteAppointmentGoogle'));
                                } else {
                                    $.Oda.Display.Notification.error($.Oda.I8n.get('activity', 'errorDeleteAppointmentGoogle') + " => " + resp.message);
                                    $.Oda.Log.error(resp);
                                }
                            });
                        }

                        var call = $.Oda.Interface.callRest($.Oda.Context.rest + "api/rest/event/"+p_params.id, {type : 'DELETE', functionRetour: function (response) {
                            $.Oda.Display.Popup.close({name:"editEvent"});
                            $('#calendar').fullCalendar( 'refetchEvents' );
                        }});

                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.deleteEvent : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {object} p_params
                 * @param p_params.id
                 * @param p_params.itemId (optional)
                 * @returns {$.Oda.Controler.Activity}
                 */
                getHtmlSelectItems : function(p_params) {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/"+p_params.id+"/search/item", {functionRetour : function(response){
                            if(response.data.length > 0){
                                $('#item')
                                    .find('option')
                                    .remove()
                                    .end()
                                ;
                                var gardian = false;
                                for(var index in response.data){
                                    var elt = response.data[index];
                                    if((elt.statusId !== "3")&&(elt.id !== "1")){
                                        gardian = true;
                                        var label = $.Oda.I8n.getByString(elt.label);
                                        $('#item')
                                            .append('<option value="'+ elt.id +'" '+ ((p_params.itemId === elt.id)?'selected':'') +'>'+ label + '</option>')
                                        ;
                                    }
                                }

                                if(gardian){$('#divItem').show();}else{$('#divItem').hide();}
                            }else{
                                $('#item')
                                    .find('option')
                                    .remove()
                                    .end()
                                ;
                                $('#divItem').hide();
                            }


                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.Controler.Activity.getHtmlSelectItems : " + er.message);
                        return null;
                    }
                },
            },
            "ManageAccounts" : {
                /**
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                start : function () {
                    try {
                        $.Oda.App.Controler.ManageAccounts.displayAccounts();
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.start : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                displayAccounts : function (p_params) {
                    try {
                        var retour = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/", { functionRetour : function(response) {
                            var objDataTable = $.Oda.Tooling.objDataTableFromJsonArray(response.data);
                            var strhtml = '<table style="width: 100%" cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered hover" id="tableAccounts">';
                            strhtml += '<tfoot><tr><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></tfoot></table>';
                            $('#tabAccounts').html(strhtml);

                            var oTable = $('#tableAccounts').DataTable({
                                "pageLength": 25,
                                "sPaginationType": "full_numbers",
                                "aaData": objDataTable.data,
                                "aaSorting": [[0, 'desc']],
                                "aoColumns": [
                                    {"sTitle": "Id", "sClass": "dataTableColCenter"},
                                    {"sTitle": "Code", "sClass": "Left"},
                                    {"sTitle": "Label", "sClass": "Left"},
                                    {"sTitle": "Statut", "sClass": "Left"},
                                    {"sTitle": "Items", "sClass": "Left"}
                                ],
                                "aoColumnDefs": [
                                    {
                                        "mRender": function (data, type, row) {
                                            if ( type === 'display' ) {
                                                var strHtml = "";
                                                strHtml += '<a onclick="$.Oda.App.Controler.ManageAccounts.accountEdit({id:\'' + row[objDataTable.entete["id"]] + '\'})" class="btn btn-primary btn-xs">' + row[objDataTable.entete["id"]] + '</a>';
                                                return strHtml;
                                            }
                                            return row[objDataTable.entete["id"]];
                                        },
                                        "aTargets": [0]
                                    },
                                    {
                                        "mRender": function (data, type, row) {
                                            return row[objDataTable.entete["code"]];
                                        },
                                        "aTargets": [1]
                                    },
                                    {
                                        "mRender": function (data, type, row) {
                                            return $.Oda.I8n.getByString(row[objDataTable.entete["label"]]);
                                        },
                                        "aTargets": [2]
                                    },
                                    {
                                        "mRender": function (data, type, row) {
                                            return $.Oda.I8n.getByString(row[objDataTable.entete["statusLabel"]]);
                                        },
                                        "aTargets": [3]
                                    },
                                    {
                                        "mRender": function (data, type, row) {
                                            var strHtml = "";
                                            var items = row[objDataTable.entete["items"]];
                                            for(var indice in items){
                                                var elt = items[indice];
                                                if(elt.code !== 'default'){
                                                    strHtml += '<a onclick="$.Oda.App.Controler.ManageAccounts.itemEdit({id:\'' + elt.id + '\'})" class="btn btn-primary btn-xs">' + elt.code + '</a> ';
                                                }
                                            }
                                            strHtml += '<a onclick="$.Oda.App.Controler.ManageAccounts.itemNew({accountId:'+row[objDataTable.entete["id"]]+', accountCode:\''+row[objDataTable.entete["code"]]+'\'})" class="btn btn-success btn-xs">Ajouter</a> ';
                                            return strHtml;
                                        },
                                        "aTargets": [4]
                                    }
                                ]
                            });

                            var table = $('#tableAccounts').DataTable();

                            $('#tableAccounts tbody').on('click', 'tr', function () {
                                if ($(this).hasClass('selected')) {
                                    $(this).removeClass('selected');
                                }
                                else {
                                    table.$('tr.selected').removeClass('selected');
                                    $(this).addClass('selected');
                                }
                            });

                            $("#tableAccounts tfoot th").each(function (i) {
                                var valOdaAttri = $(this).attr("oda-attr");
                                if (valOdaAttri == "select") {
                                    var select = $('<select data-mini="true"><option></option></select>')
                                        .appendTo($(this).empty())
                                        .on('change', function () {
                                            var val = $(this).val();

                                            table.column(i)
                                                .search(val ? '^' + $(this).val() + '$' : val, true, false)
                                                .draw();
                                        });

                                    table.column(i - 1).data().unique().sort().each(function (d, j) {
                                        select.append('<option value="' + d + '">' + d + '</option>');
                                    });
                                } else {
                                    if($(this).html() !== 'null'){
                                        $('<input type="text" placeholder="Search" size="4"/>')
                                            .appendTo($(this).empty())
                                            .on('keyup change', function () {
                                                table
                                                    .column(i)
                                                    .search(this.value)
                                                    .draw();
                                            });
                                    }else{
                                        $(this).html('')
                                    }
                                }
                            });
                        }}, {"mode":"full"});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.displayAccounts : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                newAccount : function () {
                    try {
                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "templateNewAccount"
                            , scope : {
                            }
                        });

                        var strFooter = "";
                        strFooter += '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.ManageAccounts.submitNewAccount();" class="btn btn-primary disabled" disabled>Submit</button >';

                        $.Oda.Display.Popup.open({
                            "name" : "newAccount",
                            "label" : $.Oda.I8n.get('manage-accounts','newAccount'),
                            "details" : strHtml,
                            "footer" : strFooter,
                            "callback" : function(e){
                                $.Oda.Scope.Gardian.add({
                                    id: "newAccount",
                                    listElt: ["code","label","salesForce"],
                                    function: function (e) {
                                        if( ($("#code").data("isOk")) && ($("#label").data("isOk")) && ($("#salesForce").data("isOk")) ){
                                            $("#submit").removeClass("disabled");
                                            $("#submit").removeAttr("disabled");
                                        }else{
                                            $("#submit").addClass("disabled");
                                            $("#submit").attr("disabled", true);
                                        }
                                    }
                                });
                            }
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.newAccount : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                submitNewAccount : function (p_params) {
                    try {
                        var tabInput = {
                            "code" : $('#code').val(),
                            "label" : $('#label').val(),
                            "salesForce" : ($('#salesForces').val()===undefined)?"":$('#salesForces').val(),
                            "userId" : $.Oda.Session.id
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/", {type:'POST',functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"newAccount"});
                            $.Oda.App.Controler.ManageAccounts.displayAccounts();
                        }},tabInput);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.submitNewAccount : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                accountEdit : function (p_params) {
                    try {
                        //TODO accountsEdit
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.accountEdit : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                itemNew : function (p_params) {
                    try {
                        var strHtml = $.Oda.Display.TemplateHtml.create({
                            template : "templateNewItem"
                            , scope : {
                            }
                        });

                        var strFooter = "";
                        strFooter += '<button type="button" oda-label="oda-main.bt-submit" oda-submit="submit" onclick="$.Oda.App.Controler.ManageAccounts.submitNewItem({accountId:\''+p_params.accountId+'\'});" class="btn btn-primary disabled" disabled>Submit</button >';

                        $.Oda.Display.Popup.open({
                            "name" : "newItem",
                            "label" : $.Oda.I8n.get('manage-accounts','newItem') + p_params.accountCode,
                            "details" : strHtml,
                            "footer" : strFooter,
                            "callback" : function(e){
                                $.Oda.Scope.Gardian.add({
                                    id: "newAccount",
                                    listElt: ["code","label","salesForce", "charge"],
                                    function: function (e) {
                                        if( ($("#code").data("isOk")) && ($("#label").data("isOk")) && ($("#salesForce").data("isOk")) && ($("#charge").data("isOk")) ){
                                            $("#submit").removeClass("disabled");
                                            $("#submit").removeAttr("disabled");
                                        }else{
                                            $("#submit").addClass("disabled");
                                            $("#submit").attr("disabled", true);
                                        }
                                    }
                                });
                            }
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.itemNew : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.accountId
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                submitNewItem : function (p_params) {
                    try {
                        var tabInput = {
                            "code" : $('#code').val(),
                            "label" : $('#label').val(),
                            "salesForce" : ($('#salesForces').val()===undefined)?"":$('#salesForces').val(),
                            "charge" : ($('#charge').val()===undefined)?0:$('#charge').val(),
                            "userId" : $.Oda.Session.id,
                            "accountId" : p_params.accountId
                        };
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/item/", {type:'POST',functionRetour : function(response){
                            $.Oda.Display.Popup.close({name:"newItem"});
                            $.Oda.App.Controler.ManageAccounts.displayAccounts();
                        }},tabInput);
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.submitNewItem : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @returns {$.Oda.App.Controler.ManageAccounts}
                 */
                itemEdit : function (p_params) {
                    try {
                        //TODO itemEdit
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ManageAccounts.itemEdit : " + er.message);
                        return null;
                    }
                },
            },
            "RapportClient" : {
                /**
                 * @returns {$.Oda.App.Controler.RapportClient}
                 */
                start: function () {
                    try {
                        $.Oda.App.Controler.RapportClient.loadSearch();
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.RapportClient.start : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.$.Oda.App.Controler.RapportClient}
                 */
                loadSearch : function () {
                    try {
                        var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/account/", {functionRetour : function(response){
                            var accounts = "";
                            for(var index in response.data){
                                var elt = response.data[index];
                                if(elt.statusId !== "3"){
                                    var label = $.Oda.I8n.getByString(elt.label);
                                    $('#account')
                                        .append('<option value="'+ elt.id +'">'+ label + '</option>')
                                    ;
                                }
                            }

                            $.Oda.Scope.Gardian.add({
                                id : "selectSearch",
                                listElt : ["account","billable"],
                                function : function(e){
                                    $.Oda.App.Controler.RapportClient.search();
                                }
                            });
                        }});
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.RapportClient.loadSearch : " + er.message);
                        return null;
                    }
                },
                /**
                 * @returns {$.Oda.App.Controler.RapportClient}
                 */
                search : function () {
                    try {
                        var account = $('#account');
                        var billable = $('#billable');
                        if(account.val() === ""){
                            $('#divRapport').html('Empty');
                        }else{
                            $.Oda.Display.loading({elt:$('#divRapport')});
                            var tabInput = {
                                "accountId" : account.val(),
                                "billable" : billable.val()
                            };
                            var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/rapport/event/client/", {functionRetour : function(response){
                                $('#divRapport').html('');
                                var listDataDisplayEvent = {};
                                var listDataItemRapport = {};
                                var totalItemRapport = {
                                    "provided": 0,
                                    "cunsumed": 0,
                                    "delta": 0,
                                };

                                for(var indice in response.data.data) {
                                    var elt = response.data.data[indice];

                                    //itemRepport
                                    if (!listDataItemRapport[elt.itemId]) {
                                        listDataItemRapport[elt.itemId]= {
                                            "id" : elt.itemId,
                                            "code" : elt.itemCode,
                                            "label" : elt.itemLabel,
                                            "accountLabel" : elt.accountLabel,
                                            "provided" : parseInt(elt.itemCharge),
                                            "cunsumed" : 0,
                                            "delta" : 0,
                                            "list" : []
                                        };
                                        totalItemRapport.provided += parseInt(elt.itemCharge);
                                    }
                                    listDataItemRapport[elt.itemId].cunsumed += parseFloat(elt.time);
                                    listDataItemRapport[elt.itemId].delta = listDataItemRapport[elt.itemId].provided - listDataItemRapport[elt.itemId].cunsumed;
                                    listDataItemRapport[elt.itemId].list.push(elt);
                                    totalItemRapport.cunsumed += parseFloat(elt.time);
                                    totalItemRapport.delta = totalItemRapport.provided - totalItemRapport.cunsumed;

                                    //displayEvent
                                    if (!listDataDisplayEvent[moment(elt.start).format('DD/MM/YYYY')]) {
                                        listDataDisplayEvent[moment(elt.start).format('DD/MM/YYYY')] = [];
                                    }
                                    listDataDisplayEvent[moment(elt.start).format('DD/MM/YYYY')].push(elt);
                                }

                                var strHtmlItems = '';
                                for(var indice in listDataItemRapport){
                                    var item = listDataItemRapport[indice];
                                    strHtmlItems += '<tr><td>'+ ((account.val()==="0")?"Account: "+$.Oda.I8n.getByString(item.accountLabel)+", ":"") + $.Oda.I8n.getByString(item.label)+'</td><td>'+item.provided+'H</td><td>'+item.cunsumed+'H</td><td>'+item.delta+'H</td></tr>'
                                }
                                var strHtml = $.Oda.Display.TemplateHtml.create({
                                    template : "itemRapport"
                                    , scope : {
                                        "items": strHtmlItems,
                                        "totalItemRapport": totalItemRapport
                                    }
                                });
                                $('#divRapport').append(strHtml);

                                $.each( listDataDisplayEvent, function( key, value ) {
                                    var strHtml = '<div><ul><li>Date : '+moment(value[0].start).format('DD/MM/YYYY')+'<ul>';
                                    for(var indice in value){
                                        var elt = value[indice];
                                        strHtml += $.Oda.Display.TemplateHtml.create({
                                            template : "eltRapport"
                                            , scope : {
                                                "title" : elt.title,
                                                "time" : elt.time,
                                                "cmt" : elt.cmt,
                                                "item" : $.Oda.I8n.getByString(elt.itemLabel),
                                                "user" : elt.userFirstName + " " + elt.userLastName,
                                                "account" : (account.val()==="0")?"Account: "+$.Oda.I8n.getByString(elt.accountLabel)+", ":"",
                                                "billable" : ((billable.val()!=="1")&&(elt.billable==="1"))?"("+ $.Oda.I8n.get("activity","activityBillable")+")":"",
                                            }
                                        });
                                    }
                                    strHtml += '</ul></li></ul></div>'
                                    $('#divRapport').append(strHtml);
                                });
                            }},tabInput);
                        }
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.RapportClient.search : " + er.message);
                        return null;
                    }
                },
            },
            "ActivityList": {
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @returns {$.Oda.App.Controler.ActivityList}
                 */
                start : function (p_params) {
                    try {
                        $.Oda.App.Controler.ActivityList.displayGantt();
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ActivityList.start : " + er.message);
                        return null;
                    }
                },
                /**
                 * @param {Object} p_params
                 * @param p_params.id
                 * @returns {$.Oda.App.Controler.ActivityList}
                 */
                displayGantt : function (p_params) {
                    try {
                        var now = moment().format('YYYY-MM-DD');
                        $('#divGrant').fullCalendar({
                            now: now,
                            editable: false,
                            aspectRatio: 1.0,
                            contentHeight: 300,
                            defaultView: 'timelineMonth',
                            resourceLabelText: 'Consultants',
                            resources: function(callback) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/config/", {functionRetour : function(response){
                                    var datas = [];
                                    for(var index in response.data){
                                        var elt = response.data[index];
                                        var consultant = {
                                            id: elt.userId,
                                            title: elt.code_user
                                        };
                                        datas.push(consultant);
                                    }
                                    callback(datas);
                                }});
                            },
                            events: function(start, end, timezone, callback) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/rapport/event/consolidated/", {functionRetour : function(response){
                                    var datas = [];
                                    for(var index in response.data){
                                        var elt = response.data[index];
                                        var start = moment(elt.start);
                                        var end = moment(start).add(1,'days');
                                        var color = 'green';
                                        if(elt.time < 4){
                                            color = 'blue';
                                        }else if(elt.time < 8){
                                            color = 'green';
                                        }else if(elt.time > 8){
                                            color = 'red';
                                        }
                                        var event = {
                                            resourceId: elt.autorId,
                                            start: start,
                                            end: end,
                                            allDay: true,
                                            title: elt.time + 'H',
                                            color: color
                                        };
                                        datas.push(event);
                                    }
                                    callback(datas);
                                }});
                            },
                        });
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.ActivityList.displayGantt : " + er.message);
                        return null;
                    }
                },
            }
        }
    };

    // Initialize
    _init();

})();
