/**
 * PACEMAKER Platform
 * Experience Flow Controller
 *
 * Version 1.0.0
 */

(function(global){

    "use strict";


    var FLOW = {

        start:
            "understand",

        understand:
            "thinking",

        thinking:
            "action",

        action:
            "growth",

        growth:
            "care",

        care:
            "continue",

        continue:
            "start"

    };


    function next(experience){

        return FLOW[experience] || null;

    }


    global.PacemakerFlowController = {

        next:
            next

    };


}(window));