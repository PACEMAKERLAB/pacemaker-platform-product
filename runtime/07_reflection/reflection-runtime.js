/**
 * PACEMAKER Platform
 * Reflection Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Reflection flow
 * - Connect Reflection Engine
 */

(function (global) {

    "use strict";


    function reflect(input) {


        return global.PacemakerReflectionEngine.reflect(
            input
        );

    }


    global.PacemakerReflectionRuntime = {

        reflect:
            reflect

    };


}(window));