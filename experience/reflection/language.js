/**
 * PACEMAKER Platform
 * Reflection Experience
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
                "Reflection",

            message:
                "Let's begin by understanding your current situation.",

            button:
                "NEXT",

            result:
                result

        };

    }

    global.PacemakerReflectionLanguage = {

        create: create

    };

}(window));