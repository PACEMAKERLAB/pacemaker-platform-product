/**
 * PACEMAKER Platform
 * Start Experience
 * Runtime
 *
 * Responsibility
 * - Execute the Start Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerStartModel.create(
                input
            );

        var decision =
            global.PacemakerStartDecision.execute(
                model
            );

        var result =
            global.PacemakerStartGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerStartLanguage.create(
                result
            );

        global.PacemakerStartRenderer.render(
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

    global.PacemakerStartRuntime = {

        execute: execute

    };

}(window));