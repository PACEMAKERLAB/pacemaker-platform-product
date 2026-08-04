/**
 * PACEMAKER Platform
 * Action Experience
 * Generator
 * Version 1.0.0
 *
 * Responsibility
 * - Generate the Action Experience result.
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
                "action",

            ready:
                decision.proceed === true,

            model:
                model

        };

    }

    global.PacemakerActionGenerator = {

        generate: generate

    };

}(window));