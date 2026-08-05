/**
 * PACEMAKER Platform
 * Intelligence Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Intelligence result structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            memoryCount:
                input.memoryCount || 0,


            insight:
                input.insight || null,


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerIntelligenceModel = {

        create:
            create

    };


}(window));