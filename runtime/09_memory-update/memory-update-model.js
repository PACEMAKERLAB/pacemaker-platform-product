/**
 * PACEMAKER Platform
 * Memory Update Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Memory Update structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            type:
                input.type || "learning",


            reflection:
                input.reflection || null,


            growth:
                input.growth || null,


            learning:
                input.learning || null,


            nextStep:
                input.nextStep || null,


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerMemoryUpdateModel = {

        create:
            create

    };


}(window));