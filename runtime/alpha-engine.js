/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.8.0
 *
 * Responsibility
 * - Execute Alpha Layer
 * - Create Context
 * - Create Memory
 * - Analyze Intelligence
 * - Generate Recommendation
 * - Create Action
 * - Execute Action
 * - Reflect Execution
 * - Generate Growth
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


        var reflection =
            global.PacemakerReflectionRuntime.reflect({

                experience:
                    input.experience || null,

                execution:
                    execution

            });


        var growth =
            global.PacemakerGrowthRuntime.grow({

                experience:
                    input.experience || null,

                reflection:
                    reflection

            });

        var memoryUpdate =
            global.PacemakerMemoryUpdateRuntime.update({

                experience:
                    input.experience || null,

                reflection:
                    reflection,

                growth:
                    growth

            });    

        var result =
            global.PacemakerResultRuntime.execute({

            experience:
                input.experience || null,

            reflection:
                reflection,

            growth:
                growth

            });



        return {

            engine:
                "alpha",

            version:
                "1.8.0",

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

            reflection:
                reflection,

            growth:
                growth,

            memoryUpdate:
                memoryUpdate,    

            result:
                result,    

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));