/**
 * PACEMAKER Platform
 * Memory Update Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Memory Update flow
 * - Connect Memory Update Engine
 */

(function (global) {

    "use strict";


    function update(input) {


        return global.PacemakerMemoryUpdateEngine.update(
            input
        );

    }


    global.PacemakerMemoryUpdateRuntime = {

        update:
            update

    };


}(window));