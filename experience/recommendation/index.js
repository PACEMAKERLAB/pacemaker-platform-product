/**
 * PACEMAKER Platform
 * Recommendation Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerRecommendationRuntime ||
            typeof global.PacemakerRecommendationRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerRecommendationRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerRecommendationRuntime.execute(
            input || {}
        );

    }

    global.PacemakerRecommendationExperience = {

        start: start

    };

}(window));