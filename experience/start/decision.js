/**
 * PACEMAKER Platform
 * Start Experience
 * Decision
 *
 * Responsibility
 * - Decide whether the Start Experience can proceed.
 */

(function (global) {

    "use strict";

    function execute(model) {

        model =
            model || {};

        return {

            experience:
                "start",

            proceed:
                true,

            model:
                model

        };

    }

    global.PacemakerStartDecision = {

        execute: execute

    };

}(window));