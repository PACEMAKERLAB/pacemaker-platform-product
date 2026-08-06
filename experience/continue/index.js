/**
 * PACEMAKER Platform
 * Continue Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerContinueRuntime ||
            typeof global.PacemakerContinueRuntime.execute !==
                "function"
        ) {

            throw new Error(
                "PacemakerContinueRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerContinueRuntime.execute(
            input || {}
        );

    }

    global.PacemakerContinueExperience = {

        start:
            start

    };

}(window));