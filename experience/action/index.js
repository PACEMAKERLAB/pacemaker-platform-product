/**
 * PACEMAKER Platform
 * Action Experience
 * Entry
 * Version 1.0.0
 *
 * Responsibility
 * - Official entry point of the Action Experience.
 */

(function (global) {

    "use strict";

    function execute(input) {

        return global
            .PacemakerActionRuntime
            .execute(input);

    }

    global.PacemakerActionExperience = {

        execute: execute

    };

}(window));