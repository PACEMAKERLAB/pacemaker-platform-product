/**
 * PACEMAKER Platform
 * Growth Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Reflection into Growth
 */

(function (global) {

    "use strict";


    function grow(input) {


        var reflection =
            input.reflection || {};


        var completed =
            reflection.completed === true;


        return global.PacemakerGrowthModel.create({

            experience:
                input.experience || null,


            stage:
                completed
                    ? "next"
                    : "current",


            progress:
                completed
                    ? "completed"
                    : "in_progress",


            direction:
                completed
                    ? "continue"
                    : "review",


            reflection:
                reflection

        });

    }


    global.PacemakerGrowthEngine = {

        grow:
            grow

    };


}(window));