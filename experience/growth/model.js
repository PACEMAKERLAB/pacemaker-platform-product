/**
 * PACEMAKER Platform
 * Growth Experience
 * Model
 * Version 1.0.0
 *
 * Responsibility
 * - Create the Growth Experience Model.
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "growth",

            version:
                "1.0.0",

            input:
                input

        };

    }

    global.PacemakerGrowthModel = {

        create: create

    };

}(window));