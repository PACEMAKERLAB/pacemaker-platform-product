/**
 * PACEMAKER Platform
 * Action Experience
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
                "Action",

            message:
                "Let's take the next actionable step.",

            button:
                "CONTINUE",

            result:
                result

        };

    }

    global.PacemakerActionLanguage = {

        create: create

    };

}(window));