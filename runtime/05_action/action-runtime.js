/**
 * PACEMAKER Platform
 * Action Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Action flow
 * - Connect Action Engine
 */

(function (global) {

    "use strict";


    function create(input) {


        return global.PacemakerActionEngine.create(
            input
        );

    }


    global.PacemakerActionRuntime = {

        create:
            create

    };


}(window));