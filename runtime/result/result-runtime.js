/**
 * PACEMAKER Platform
 * Result Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Result flow
 * - Generate and Render Result
 */

(function (global) {

    "use strict";


    function execute(input) {


        var result =
            global.PacemakerResultGenerator.generate(
                input
            );


        global.PacemakerResultRenderer.render(
            result
        );


        return result;

    }


    global.PacemakerResultRuntime = {

        execute:
            execute

    };


}(window));