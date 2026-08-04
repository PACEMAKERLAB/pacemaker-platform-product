/**
 * PACEMAKER Platform
 * Growth Experience
 * Runtime
 * Version 1.0.0
 *
 * Responsibility
 * - Execute the Growth Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var model =
            global.PacemakerGrowthModel.create(
                input
            );

        var decision =
            global.PacemakerGrowthDecision.execute(
                model
            );

        var result =
            global.PacemakerGrowthGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerGrowthLanguage.create(
                result
            );

        global.PacemakerGrowthRenderer.render(
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

    global.PacemakerGrowthRuntime = {

        execute: execute

    };

}(window));