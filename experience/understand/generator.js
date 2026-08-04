/**
 * PACEMAKER Platform
 * Understand Experience
 * Generator
 * Version 1.0.0
 *
 * Responsibility
 * - Generate the Understand Experience result.
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
                "understand",

            ready:
                decision.proceed === true,

            model:
                model

        };

    }

    global.PacemakerUnderstandGenerator = {

        generate: generate

    };

}(window));