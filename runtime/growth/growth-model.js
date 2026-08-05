/**
 * PACEMAKER Platform
 * Growth Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Growth structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            stage:
                input.stage || "current",


            progress:
                input.progress || "in_progress",


            direction:
                input.direction || "continue",


            reflection:
                input.reflection || null,


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerGrowthModel = {

        create:
            create

    };


}(window));