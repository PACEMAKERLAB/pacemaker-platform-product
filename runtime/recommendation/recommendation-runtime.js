/**
 * PACEMAKER Platform
 * Recommendation Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Recommendation flow
 * - Connect Recommendation Engine
 */

(function (global) {

    "use strict";


    function recommend(input) {


        return global.PacemakerRecommendationEngine.recommend(
            input
        );

    }


    global.PacemakerRecommendationRuntime = {

        recommend:
            recommend

    };


}(window));