/**
 * PACEMAKER Platform
 * Action Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerActionRuntime ||
            typeof global.PacemakerActionRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerActionRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerActionRuntime.execute(
            input || {}
        );

    }

    global.PacemakerActionExperience = {

        start: start

    };

}(window));