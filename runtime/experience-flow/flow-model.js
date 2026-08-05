/**
 * PACEMAKER Platform
 * Experience Flow Model
 *
 * Version 1.0.0
 */

(function(global){

    "use strict";


    function create(input){

        return {

            experience:
                input.experience || "start",

            stage:
                input.stage || "start",

            next:
                null

        };

    }


    global.PacemakerFlowModel = {

        create:create

    };


}(window));