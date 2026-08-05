/**
 * PACEMAKER Platform
 * Experience Runtime Registry
 *
 * Sprint 186
 * Version 1.0.0
 */

(function(global){

    "use strict";


    var registry = {


        understand:

            "PacemakerUnderstandRuntime",


        thinking:

            "PacemakerThinkingRuntime",


        action:

            "PacemakerActionRuntime",


        growth:

            "PacemakerGrowthRuntime"


    };


    function get(experience){


        return registry[experience] || null;


    }


    global.PacemakerExperienceRuntimeRegistry = {


        get:
            get


    };


}(window));