/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.4.0
 *
 * Responsibility
 * - Execute Alpha Layer
 * - Create Context
 * - Create Memory
 * - Analyze Intelligence
 * - Generate Recommendation
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


        var recommendation =
            global.PacemakerRecommendationRuntime.recommend({

                experience:
                    input.experience || null,

                intelligence:
                    intelligence

            });


        return {

            engine:
                "alpha",

            version:
                "1.4.0",

            context:
                context,

            memory:
                memory,

            intelligence:
                intelligence,

            recommendation:
                recommendation,

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));