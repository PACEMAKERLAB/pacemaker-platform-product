/**
 * PACEMAKER Platform
 * Memory Update Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Reflection and Growth into Memory Update
 */

(function (global) {

    "use strict";


    function update(input) {


        var reflection =
            input.reflection || {};


        var growth =
            input.growth || {};


        return global.PacemakerMemoryUpdateModel.create({

            experience:
                input.experience || null,


            type:
                "learning",


            reflection:
                reflection,


            growth:
                growth,


            learning:
                reflection.learning ||
                "Experience learning created.",


            nextStep:
                growth.direction === "continue"
                    ? "Continue next growth step."
                    : "Review current growth step."

        });

    }


    global.PacemakerMemoryUpdateEngine = {

        update:
            update

    };


}(window));