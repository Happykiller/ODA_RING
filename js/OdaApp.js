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

        /**
         * @param {object} p_params
         * @param p_params.id
         * @returns {$.Oda.App}
         */
        exemple: function (p_params) {
            try {
                return this;
            } catch (er) {
                $.Oda.Log.error("$.Oda.App.exemple : " + er.message);
                return null;
            }
        },

        "Controler" : {
            "Activity" : {
                /**
                 */
                start: function () {
                    try {
                        $('#calendar').fullCalendar({
                            lang: 'fr',
                            weekNumbers : true,
                            dayClick: function(date, jsEvent, view) {

                                alert('Clicked on: ' + date.format());

                                alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

                                alert('Current view: ' + view.name);

                                // change the day's background color just for fun
                                $(this).css('background-color', 'red');

                            },
                            events: function(start, end, timezone, callback) {
                                var call = $.Oda.Interface.callRest($.Oda.Context.rest+"api/rest/event/userId/"+3, {functionRetour : function(response){
                                    callback(response.data);
                                }});
                            },
                        })
                        return this;
                    } catch (er) {
                        $.Oda.Log.error("$.Oda.App.Controler.Activity.start : " + er.message);
                        return null;
                    }
                },
            }
        }

    };

    // Initialize
    _init();

})();
