/**
 * PACEMAKER Platform
 * Reflection Experience
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
            global.PacemakerReflectionModel.create(
                input
            );

        var decision =
            global.PacemakerReflectionDecision.execute(
                model
            );

        var result =
            global.PacemakerReflectionGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerReflectionLanguage.create(
                result
            );

        global.PacemakerReflectionRenderer.render(
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

    global.PacemakerReflectionRuntime = {

    execute:
        execute

};

}(window));