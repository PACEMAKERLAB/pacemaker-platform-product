/**
 * PACEMAKER Platform
 * Experience Navigation Controller
 *
 * Version 1.1.0
 *
 * Responsibility
 * - Resolve Experience Route
 */

(function(global){

    "use strict";


    var ROUTES = {


        start:

            "experience/start/start.html",


        understand:

            "experience/understand/understand.html",


        analyze:

            "experience/analyze/analyze.html",    
            

        reflection:

            "experience/reflection/reflection.html",    


        thinking:

            "experience/thinking/thinking.html",


        action:

            "experience/action/action.html",


        growth:

            "experience/growth/growth.html",


        result:

            "experience/result/result.html",


        care:

            "experience/care/care.html",


        continue:

            "experience/continue/continue.html"


    };



    function resolve(experience){


        return ROUTES[experience] || null;


    }



    global.PacemakerNavigationController = {


        resolve:

            resolve


    };



}(window));