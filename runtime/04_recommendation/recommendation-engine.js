/**
 * PACEMAKER Platform
 * Recommendation Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Generate next step recommendation
 */

(function (global) {

    "use strict";


    function recommend(input) {


        var intelligence =
            input.intelligence || {};


        var recommendation =
            "Start next growth step.";


        var reason =
            "Based on current experience.";


        if (
            intelligence.memoryCount > 0
        ) {

            recommendation =
                "Continue from previous experience.";

            reason =
                "Previous experience data exists.";

        }


        return global.PacemakerRecommendationModel.create({

            experience:
                input.experience || null,


            recommendation:
                recommendation,


            reason:
                reason,


            priority:
                "normal"

        });

    }


    global.PacemakerRecommendationEngine = {

        recommend:
            recommend

    };


}(window));