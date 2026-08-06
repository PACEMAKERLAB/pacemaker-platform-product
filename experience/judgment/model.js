/**
 * PACEMAKER Platform
 * Judgment Model
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function create(input) {

        input = input || {};

        return {

            experience:
                "judgment",

            stage:
                "judgment",

            input:
                input,

            createdAt:
                new Date().toISOString()

        };

    }

    global.PacemakerJudgmentModel = {

        create: create

    };

}(this));