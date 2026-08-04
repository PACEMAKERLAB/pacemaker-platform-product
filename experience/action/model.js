/**
 * PACEMAKER Platform
 * Action Experience
 * Model
 * Version 1.0.0
 *
 * Responsibility
 * - Create the Action Experience Model.
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "action",

            version:
                "1.0.0",

            input:
                input

        };

    }

    global.PacemakerActionModel = {

        create: create

    };

}(window));