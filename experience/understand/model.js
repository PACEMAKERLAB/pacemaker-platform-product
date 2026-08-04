/**
 * PACEMAKER Platform
 * Understand Experience
 * Model
 * Version 1.0.0
 *
 * Responsibility
 * - Create the Understand Experience Model.
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "understand",

            version:
                "1.0.0",

            input:
                input

        };

    }

    global.PacemakerUnderstandModel = {

        create: create

    };

}(window));