/**
 * PACEMAKER Platform
 * Growth Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerGrowthRuntime ||
            typeof global.PacemakerGrowthRuntime.execute !== "function"
        ) {

            throw new Error(
                "PacemakerGrowthRuntime을 찾을 수 없습니다."
            );

        }

        return global.PacemakerGrowthRuntime.execute(
            input || {}
        );

    }

    global.PacemakerGrowthExperience = {

        start: start

    };

}(window));