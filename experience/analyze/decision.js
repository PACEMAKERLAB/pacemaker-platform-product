/**
 * PACEMAKER Platform
 * Analyze Experience
 * Decision
 * Version 1.0.0
 *
 * Responsibility
 * - Decide whether the Analyze Experience can proceed.
 */

(function (global) {

    "use strict";

    function execute(model) {

        model =
            model || {};

        return {

            experience:
                "analyze",

            proceed:
                true,

            model:
                model

        };

    }

    global.PacemakerAnalyzeDecision = {

        execute: execute

    };

}(window));