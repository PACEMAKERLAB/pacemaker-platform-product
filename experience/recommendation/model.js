/**
 * PACEMAKER Platform
 * Recommendation Model
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function create(input) {

        input = input || {};

        return {

            experience:
                "recommendation",

            stage:
                "recommendation",

            input:
                input,

            createdAt:
                new Date().toISOString()

        };

    }

    global.PacemakerRecommendationModel = {

        create: create

    };

}(this));