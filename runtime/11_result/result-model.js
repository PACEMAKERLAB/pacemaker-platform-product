/**
 * PACEMAKER Platform
 * Result Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Result structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            title:
                input.title || "PACEMAKER Result",


            summary:
                input.summary || null,


            nextStep:
                input.nextStep || null,


            status:
                input.status || "ready",


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerResultModel = {

        create:
            create

    };


}(window));