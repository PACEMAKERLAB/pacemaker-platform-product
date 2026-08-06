/**
 * PACEMAKER Platform
 * Interpretation Language
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(result) {

        return {

            title:
                "Interpretation",

            description:
                "Interpretation Experience",

            result:
                result

        };

    }

    global.PacemakerInterpretationLanguage = {

        execute: execute

    };

}(this));