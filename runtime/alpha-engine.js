/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.3.0
 *
 * Responsibility
 * - Execute Alpha Layer
 * - Create Context
 * - Create Memory
 * - Analyze Intelligence
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


        var intelligence =
            global.PacemakerIntelligenceRuntime.analyze({

                experience:
                    input.experience || null

            });


        return {

            engine:
                "alpha",

            version:
                "1.3.0",

            context:
                context,

            memory:
                memory,

            intelligence:
                intelligence,

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));