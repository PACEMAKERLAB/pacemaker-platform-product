/**
 * PACEMAKER Platform
 * Execution Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Execution flow
 * - Connect Execution Engine
 */

(function (global) {

    "use strict";


    function execute(input) {


        return global.PacemakerExecutionEngine.execute(
            input
        );

    }


    global.PacemakerExecutionRuntime = {

        execute:
            execute

    };


}(window));