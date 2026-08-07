/**
 * PACEMAKER Platform Product v2
 * Derived Work Runtime
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    global.PacemakerV2.Runtime.DerivedWork = Object.freeze({
        execute: function (operation, input) {
            return global.PacemakerV2.Engine.WorkDerivation.Engine.derive(operation, input || {});
        }
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
