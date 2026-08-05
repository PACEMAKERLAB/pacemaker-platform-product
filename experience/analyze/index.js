/**
 * PACEMAKER Platform
 * Analyze Experience
 * Entry
 * Version 1.0.0
 *
 * Responsibility
 * - Official entry point of the Analyze Experience.
 */

(function (global) {

    "use strict";

    function execute(input) {

        return global
            .PacemakerAnalyzeRuntime
            .execute(input);

    }

    global.PacemakerAnalyzeExperience = {

        execute: execute

    };

}(window));