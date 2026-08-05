/**
 * PACEMAKER Platform
 * Experience Navigation Model
 *
 * Version 1.0.0
 */

(function(global){

    "use strict";


    function create(input){

        return {

            experience:
                input.experience || "start",

            route:
                null

        };

    }


    global.PacemakerNavigationModel = {

        create:
            create

    };


}(window));