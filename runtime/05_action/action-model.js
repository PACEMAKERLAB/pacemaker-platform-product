/**
 * PACEMAKER Platform
 * Action Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Action structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            task:
                input.task || null,


            status:
                input.status || "ready",


            priority:
                input.priority || "normal",


            source:
                input.source || "recommendation",


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerActionModel = {

        create:
            create

    };


}(window));