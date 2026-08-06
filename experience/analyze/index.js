/**
 * PACEMAKER Platform
 * Analyze Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerAnalyzeRuntime ||
            typeof global.PacemakerAnalyzeRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerAnalyzeRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerAnalyzeRuntime.execute(
            input || {}
        );

    }

    global.PacemakerAnalyzeExperience = {

        start: start

    };

}(window));