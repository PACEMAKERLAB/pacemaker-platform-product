/**
 * PACEMAKER Platform
 * Result Generator
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Alpha Result into User Result
 */

(function (global) {

    "use strict";


    function generate(input) {


        var growth =
            input.growth || {};


        var reflection =
            input.reflection || {};


        return global.PacemakerResultModel.create({

            experience:
                input.experience || null,


            title:
                "Growth Result",


            summary:
                reflection.summary ||
                "Your growth process has been completed.",


            nextStep:
                growth.direction === "continue"
                    ? "Continue next growth step."
                    : "Review current step.",


            status:
                "completed"

        });

    }


    global.PacemakerResultGenerator = {

        generate:
            generate

    };


}(window));