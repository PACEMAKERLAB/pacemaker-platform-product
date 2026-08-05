/**
 * PACEMAKER Platform
 * Experience Flow Controller
 *
 * Sprint 188
 * Version 1.1.0
 *
 * Responsibility
 * - Define Experience Journey order
 */

(function(global){

    "use strict";


    var FLOW = {


        start:
            "understand",


        understand:
            "reflection",


        reflection:
            "thinking",


        thinking:
            "interpretation",


        interpretation:
            "judgment",


        judgment:
            "recommendation",


        recommendation:
            "action",


        action:
            "growth",


        growth:
            "result",


        result:
            "care",


        care:
            "continue",


        continue:
            null


    };



    function next(experience){


        return FLOW[experience] || null;


    }



    function getFlow(){


        return FLOW;


    }



    global.PacemakerFlowController = {


        next:
            next,


        getFlow:
            getFlow


    };


}(window));