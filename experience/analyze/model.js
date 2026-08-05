/**
 * PACEMAKER Platform
 * Analyze Experience
 * Model
 * Version 1.0.0
 *
 * Responsibility
 * - Create the Analyze Experience Model.
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "analyze",

            version:
                "1.0.0",

            input:
                input

        };

    }

    global.PacemakerAnalyzeModel = {

        create: create

    };

}(window));