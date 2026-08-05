/**
 * PACEMAKER Platform
 * Intelligence Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Intelligence flow
 * - Connect Intelligence Engine
 */

(function (global) {

    "use strict";


    function analyze(input) {


        return global.PacemakerIntelligenceEngine.analyze(
            input
        );

    }


    global.PacemakerIntelligenceRuntime = {

        analyze:
            analyze

    };


}(window));