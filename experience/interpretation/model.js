/**
 * PACEMAKER Platform
 * Interpretation Model
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function create(input) {

        input =
            input || {};

        return {

            experience:
                "interpretation",

            stage:
                "interpretation",

            input:
                input,

            createdAt:
                new Date().toISOString()

        };

    }

    global.PacemakerInterpretationModel = {

        create: create

    };

}(this));