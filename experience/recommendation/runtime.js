/**
 * PACEMAKER Platform
 * Recommendation Runtime
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerRecommendationModel.create(
                input
            );

        var decision =
            global.PacemakerRecommendationDecision.execute(
                model
            );

        var result =
            global.PacemakerRecommendationGenerator.execute(
                decision
            );

        var language =
            global.PacemakerRecommendationLanguage.execute(
                result
            );

        global.PacemakerRecommendationRenderer.render(
            language
        );

        return {

            experience:
                "recommendation",

            status:
                "completed",

            result:
                result,

            output:
                language,

            nextStep: {

                navigation: {

                    route:
                        "experience/action/action.html"

                }

            }

        };

    }

    global.PacemakerRecommendationRuntime = {

        execute: execute

    };

}(this));