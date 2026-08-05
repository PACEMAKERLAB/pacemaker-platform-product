/**
 * PACEMAKER Platform
 * Intelligence Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Analyze Memory
 * - Generate Insight
 */

(function (global) {

    "use strict";


    function analyze(input) {


        var memories =
            global.PacemakerMemoryRuntime.getAll();


        var insight =
            null;


        if (
            memories.length > 0
        ) {

            insight =
                "Previous experience found.";

        } else {

            insight =
                "First experience.";

        }


        return global.PacemakerIntelligenceModel.create({

            experience:
                input.experience || null,


            memoryCount:
                memories.length,


            insight:
                insight

        });

    }


    global.PacemakerIntelligenceEngine = {

        analyze:
            analyze

    };


}(window));