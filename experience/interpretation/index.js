/**
 * PACEMAKER Platform
 * Interpretation Experience Index
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function start(input) {

        if (
            !global.PacemakerInterpretationRuntime ||
            typeof global
                .PacemakerInterpretationRuntime
                .execute !== "function"
        ) {

            throw new Error(
                "PacemakerInterpretationRuntime을 찾을 수 없습니다."
            );

        }

        return global
            .PacemakerInterpretationRuntime
            .execute(
                input || {}
            );

    }

    global.PacemakerInterpretationExperience = {

        start: start

    };

}(this));