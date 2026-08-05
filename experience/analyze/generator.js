/**
 * PACEMAKER Platform
 * Analyze Experience
 * Generator
 * Version 1.0.0
 *
 * Responsibility
 * - Generate the Analyze Experience result.
 */

(function (global) {

    "use strict";

    function generate(
        decision,
        model
    ) {

        decision =
            decision || {};

        model =
            model || {};

        return {

            experience:
                "analyze",

            ready:
                decision.proceed === true,

            model:
                model

        };

    }

    global.PacemakerAnalyzeGenerator = {

        generate: generate

    };

}(window));