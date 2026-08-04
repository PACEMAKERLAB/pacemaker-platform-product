/**
 * PACEMAKER Platform
 * Start Experience
 * Entry
 * Version 1.0.0
 *
 * Responsibility
 * - Official entry point of the Start Experience.
 */

(function (global) {

    "use strict";

    function execute(input) {

        return global
            .PacemakerStartRuntime
            .execute(input);

    }

    global.PacemakerStartExperience = {

        execute: execute

    };

}(window));