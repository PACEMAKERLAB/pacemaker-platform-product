/**
 * PACEMAKER Platform
 * Start Experience
 * Generator
 *
 * Responsibility
 * - Generate the Start Experience result.
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
                "start",

            ready:
                decision.proceed === true,

            model:
                model

        };

    }

    global.PacemakerStartGenerator = {

        generate: generate

    };

}(window));