/**
 * PACEMAKER Platform
 * Understand Experience
 * Entry
 * Version 1.0.0
 *
 * Responsibility
 * - Official entry point of the Understand Experience.
 */

(function (global) {

    "use strict";

    function execute(input) {

        return global
            .PacemakerUnderstandRuntime
            .execute(input);

    }

    global.PacemakerUnderstandExperience = {

        execute: execute

    };

}(window));