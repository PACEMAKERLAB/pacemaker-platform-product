/**
 * PACEMAKER Platform
 * Analyze Experience
 * Runtime
 * Version 1.0.0
 *
 * Responsibility
 * - Execute the Analyze Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerAnalyzeModel.create(
                input
            );

        var decision =
            global.PacemakerAnalyzeDecision.execute(
                model
            );

        var result =
            global.PacemakerAnalyzeGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerAnalyzeLanguage.create(
                result
            );

        global.PacemakerAnalyzeRenderer.render(
            language
        );

        return {

            status:
                "completed",

            result:
                result,

            nextStep:
                null

        };

    }

    global.PacemakerAnalyzeRuntime = {

        execute: execute

    };

}(window));