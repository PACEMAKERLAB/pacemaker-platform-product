/**
 * PACEMAKER Platform
 * Interpretation Runtime
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global
                .PacemakerInterpretationModel
                .create(
                    input
                );

        var decision =
            global
                .PacemakerInterpretationDecision
                .execute(
                    model
                );

        var result =
            global
                .PacemakerInterpretationGenerator
                .execute(
                    decision
                );

        var language =
            global
                .PacemakerInterpretationLanguage
                .execute(
                    result
                );

        global
            .PacemakerInterpretationRenderer
            .render(
                language
            );

        return {

            experience:
                "interpretation",

            status:
                "completed",

            result:
                result,

            output:
                language,

            nextStep: {

                navigation: {

                    route:
                        "experience/judgment/judgment.html"

                }

            }

        };

    }

    global.PacemakerInterpretationRuntime = {

        execute: execute

    };

}(this));