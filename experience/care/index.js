/**
 * PACEMAKER Platform
 * Care Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerCareRuntime ||
            typeof global.PacemakerCareRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerCareRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerCareRuntime.execute(
            input || {}
        );

    }

    global.PacemakerCareExperience = {

        start: start

    };

}(window));