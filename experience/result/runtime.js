/**
 * PACEMAKER Platform
 * Result Experience Runtime
 *
 * Sprint 191
 * Version 1.1.0
 *
 * Responsibility
 * - Connect Result Experience and Result Runtime
 */

(function (global) {

    "use strict";


    function execute(input) {

        var result =

            global.PacemakerResultRuntime.execute(

                input || {}

            );


        return {

            experience:

                "result",

            status:

                "completed",

            result:

                result,

            nextStep: {

                navigation: {

                    route:

                        "experience/care/care.html"

                }

            }

        };

    }


    global.PacemakerResultExperienceRuntime = {

        execute:

            execute

    };


}(window));