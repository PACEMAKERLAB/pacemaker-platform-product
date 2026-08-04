/**
 * PACEMAKER Platform
 * Action Experience
 * Decision
 * Version 1.0.0
 *
 * Responsibility
 * - Decide whether the Action Experience can proceed.
 */

(function (global) {

    "use strict";

    function execute(model) {

        model =
            model || {};

        return {

            experience:
                "action",

            proceed:
                true,

            model:
                model

        };

    }

    global.PacemakerActionDecision = {

        execute: execute

    };

}(window));