/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.2.0
 *
 * Responsibility
 * - Execute Alpha Layer
 * - Create Context
 * - Create Memory Record
 */

(function (global) {

    "use strict";


    function execute(input) {


        if (!input) {

            throw new Error(
                "PACEMAKER Alpha Engine: input is required."
            );

        }


        var context =
            global.PacemakerContextRuntime.create({

                experience:
                    input.experience || null

            });


        var memory =
            global.PacemakerMemoryRuntime.create({

                experience:
                    input.experience || null,

                type:
                    "experience",

                data:
                    context

            });


        return {

            engine:
                "alpha",

            version:
                "1.2.0",

            context:
                context,

            memory:
                memory,

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));