/**
 * PACEMAKER Platform
 * Understand Experience
 * Decision
 * Version 1.0.0
 *
 * Responsibility
 * - Decide whether the Understand Experience can proceed.
 */

(function (global) {

    "use strict";

    function execute(model) {

        model =
            model || {};

        return {

            experience:
                "understand",

            proceed:
                true,

            model:
                model

        };

    }

    global.PacemakerReflectionDecision = {

    execute:
        execute

};

}(window));