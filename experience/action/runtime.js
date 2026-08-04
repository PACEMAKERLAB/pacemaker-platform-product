/**
 * PACEMAKER Platform
 * Action Experience
 * Runtime
 * Version 1.0.0
 *
 * Responsibility
 * - Execute the Action Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerActionModel.create(
                input
            );

        var decision =
            global.PacemakerActionDecision.execute(
                model
            );

        var result =
            global.PacemakerActionGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerActionLanguage.create(
                result
            );

        global.PacemakerActionRenderer.render(
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

    global.PacemakerActionRuntime = {

        execute: execute

    };

}(window));