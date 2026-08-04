/**
 * PACEMAKER Platform
 * Understand Experience
 * Runtime
 * Version 1.0.0
 *
 * Responsibility
 * - Execute the Understand Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerUnderstandModel.create(
                input
            );

        var decision =
            global.PacemakerUnderstandDecision.execute(
                model
            );

        var result =
            global.PacemakerUnderstandGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerUnderstandLanguage.create(
                result
            );

        global.PacemakerUnderstandRenderer.render(
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

    global.PacemakerUnderstandRuntime = {

        execute: execute

    };

}(window));