/**
 * PACEMAKER Platform
 * Start Experience
 * Model
 *
 * Responsibility
 * - Create the Start Experience Model.
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "start",

            version:
                "1.0.0",

            input:
                input

        };

    }

    global.PacemakerStartModel = {

        create: create

    };

}(window));