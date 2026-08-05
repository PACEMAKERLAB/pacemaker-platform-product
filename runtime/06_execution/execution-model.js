/**
 * PACEMAKER Platform
 * Execution Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Execution structure
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


            result:
                input.result || null,


            source:
                input.source || "action",


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerExecutionModel = {

        create:
            create

    };


}(window));