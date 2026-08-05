/**
 * PACEMAKER Platform
 * Experience Runtime Mapping
 *
 * Sprint 186
 * Version 1.0.0
 */

(function(global){

    "use strict";


    var mappings = {


        understand: {

            runtime: [

                "context",
                "memory",
                "intelligence",
                "result"

            ]

        },


        thinking: {

            runtime: [

                "intelligence",
                "recommendation",
                "result"

            ]

        },


        action: {

            runtime: [

                "recommendation",
                "action",
                "execution",
                "result"

            ]

        },


        growth: {

            runtime: [

                "growth",
                "memory-update",
                "persistence",
                "result"

            ]

        }


    };


    function get(experience){


        return mappings[experience] || null;


    }


    global.PacemakerExperienceRuntimeMapping = {


        get:
            get


    };


}(window));