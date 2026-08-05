/**
 * PACEMAKER Platform
 * Experience Navigation Controller
 *
 * Version 1.0.0
 */

(function(global){

    "use strict";


    var ROUTES = {

        start:
            "experience/start.html",

        understand:
            "experience/understand.html",

        thinking:
            "experience/thinking.html",

        action:
            "experience/action.html",

        growth:
            "experience/growth.html",

        care:
            "experience/care.html",

        continue:
            "experience/continue.html"

    };


    function resolve(experience){


        return ROUTES[experience] || null;


    }


    global.PacemakerNavigationController = {

        resolve:
            resolve

    };


}(window));