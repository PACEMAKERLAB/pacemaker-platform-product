/**
 * PACEMAKER Platform
 * Growth Experience
 * Generator
 * Version 1.0.0
 *
 * Responsibility
 * - Generate the Growth Experience result.
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
                "growth",

            ready:
                decision.proceed === true,

            model:
                model

        };

    }

    global.PacemakerGrowthGenerator = {

        generate: generate

    };

}(window));