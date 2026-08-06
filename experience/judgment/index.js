/**
 * PACEMAKER Platform
 * Judgment Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerJudgmentRuntime ||
            typeof global.PacemakerJudgmentRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerJudgmentRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerJudgmentRuntime.execute(
            input || {}
        );

    }

    global.PacemakerJudgmentExperience = {

        start: start

    };

}(window));