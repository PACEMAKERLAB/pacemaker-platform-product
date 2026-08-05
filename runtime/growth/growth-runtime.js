/**
 * PACEMAKER Platform
 * Growth Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Growth flow
 * - Connect Growth Engine
 */

(function (global) {

    "use strict";


    function grow(input) {


        return global.PacemakerGrowthEngine.grow(
            input
        );

    }


    global.PacemakerGrowthRuntime = {

        grow:
            grow

    };


}(window));