/**
 * PACEMAKER Platform
 * Growth Experience
 *
 * Entry
 * Version 1.0.0
 *
 * Responsibility
 * - Expose Growth Experience entry point
 * - Connect Growth Runtime
 */

(function (global) {

    "use strict";


    function execute(input) {


        if (
            !global.PacemakerGrowthRuntime ||
            typeof global.PacemakerGrowthRuntime.execute !== "function"
        ) {

            throw new Error(
                "PACEMAKER Growth Experience: Runtime not found."
            );

        }


        return global.PacemakerGrowthRuntime.execute(
            input || {}
        );

    }


    global.PacemakerGrowthExperience = {

        execute:
            execute

    };


}(window));