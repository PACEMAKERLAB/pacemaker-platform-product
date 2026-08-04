/**
 * PACEMAKER Platform
 * Start Experience
 * Language
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
                "PACEMAKER Platform",

            message:
                "Do Better.\nKnow Better.\nTogether Better.",

            button:
                "START",

            result:
                result

        };

    }

    global.PacemakerStartLanguage = {

        create: create

    };

}(window));