/**
 * PACEMAKER Platform
 * Analyze Experience
 * Language
 * Version 1.0.0
 *
 * Responsibility
 * - Convert the generated result into user-facing language.
 */

(function (global) {

    "use strict";

    function create(result) {

        result =
            result || {};

        return {

            title:
                "Analyze",

            message:
                "Let's begin by analyzing your current situation.",

            button:
                "NEXT",

            result:
                result

        };

    }

    global.PacemakerAnalyzeLanguage = {

        create: create

    };

}(window));