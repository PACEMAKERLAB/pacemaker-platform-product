/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.6.0
 *
 * Responsibility
 * - Execute Alpha Layer
 * - Create Context
 * - Create Memory
 * - Analyze Intelligence
 * - Generate Recommendation
 * - Create Action
 * - Execute Action
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


        var action =
            global.PacemakerActionRuntime.create({

                experience:
                    input.experience || null,

                recommendation:
                    recommendation

            });


        var execution =
            global.PacemakerExecutionRuntime.execute({

                experience:
                    input.experience || null,

                action:
                    action

            });


        return {

            engine:
                "alpha",

            version:
                "1.6.0",

            context:
                context,

            memory:
                memory,

            intelligence:
                intelligence,

            recommendation:
                recommendation,

            action:
                action,

            execution:
                execution,

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));