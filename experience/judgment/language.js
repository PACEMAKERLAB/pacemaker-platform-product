/**
 * PACEMAKER Platform
 * Judgment Language
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(result) {

        return {

            title:
                "Judgment",

            description:
                "Judgment Experience",

            result:
                result

        };

    }

    global.PacemakerJudgmentLanguage = {

        execute: execute

    };

}(this));