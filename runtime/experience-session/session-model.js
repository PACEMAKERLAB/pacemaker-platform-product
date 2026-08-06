/**
 * PACEMAKER Platform
 * Experience Session Model
 *
 * Sprint 189
 * Version 1.1.0
 *
 * Responsibility
 * - Define Experience Session structure
 * - Hold shared operation state
 */

(function (global) {

    "use strict";


    function create(input) {

        input =
            input || {};


        return {

            id:

                input.id ||
                (
                    "session-" +
                    Date.now()
                ),


            experience:

                input.experience ||
                null,


            protocol:

                input.protocol ||
                null,


            status:

                input.status ||
                "started",


            operation: {

                stage:

                    input.stage ||
                    null,

                status:

                    input.operationStatus ||
                    "ready",

                tasks:

                    Array.isArray(
                        input.tasks
                    )
                        ? input.tasks
                        : [],

                documents:

                    Array.isArray(
                        input.documents
                    )
                        ? input.documents
                        : [],

                outputs:

                    Array.isArray(
                        input.outputs
                    )
                        ? input.outputs
                        : []

            },


            startedAt:

                input.startedAt ||
                new Date().toISOString(),


            history:

                Array.isArray(
                    input.history
                )
                    ? input.history
                    : []

        };

    }


    global.PacemakerExperienceSessionModel = {

        create:

            create

    };


}(window));