/**
 * PACEMAKER Platform
 * Context Model
 *
 * Version 1.0.0
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,

            stage:
                input.stage || "start",

            history:
                [],

            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerContextModel = {

        create:
            create

    };


}(window));