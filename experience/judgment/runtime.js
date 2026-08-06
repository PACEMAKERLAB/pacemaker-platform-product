/**
 * PACEMAKER Platform
 * Judgment Runtime
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerJudgmentModel.create(
                input
            );

        var decision =
            global.PacemakerJudgmentDecision.execute(
                model
            );

        var result =
            global.PacemakerJudgmentGenerator.execute(
                decision
            );

        var language =
            global.PacemakerJudgmentLanguage.execute(
                result
            );

        global.PacemakerJudgmentRenderer.render(
            language
        );

        return {

            experience:
                "judgment",

            status:
                "completed",

            result:
                result,

            output:
                language,

            nextStep: {

                navigation: {

                    route:
                        "experience/recommendation/recommendation.html"

                }

            }

        };

    }

    global.PacemakerJudgmentRuntime = {

        execute: execute

    };

}(this));