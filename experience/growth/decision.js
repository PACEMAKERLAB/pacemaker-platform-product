/**
 * PACEMAKER Platform
 * Growth Experience
 * Decision
 * Version 1.0.0
 *
 * Responsibility
 * - Decide whether the Growth Experience can proceed.
 */

(function (global) {

    "use strict";

    function execute(model) {

        model =
            model || {};

        return {

            experience:
                "growth",

            proceed:
                true,

            model:
                model

        };

    }

    global.PacemakerGrowthDecision = {

        execute: execute

    };

}(window));