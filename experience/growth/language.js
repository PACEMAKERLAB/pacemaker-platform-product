/**
 * PACEMAKER Platform
 * Growth Experience
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
                "Growth",

            message:
                "Let's review your growth and prepare the next step.",

            button:
                "FINISH",

            result:
                result

        };

    }

    global.PacemakerGrowthLanguage = {

        create: create

    };

}(window));