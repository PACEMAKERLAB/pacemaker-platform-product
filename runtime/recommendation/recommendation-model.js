/**
 * PACEMAKER Platform
 * Recommendation Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Recommendation structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            recommendation:
                input.recommendation || null,


            reason:
                input.reason || null,


            priority:
                input.priority || "normal",


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerRecommendationModel = {

        create:
            create

    };


}(window));