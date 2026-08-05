/**
 * PACEMAKER Platform
 * Reflection Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Execution into Reflection
 */

(function (global) {

    "use strict";


    function reflect(input) {


        var execution =
            input.execution || {};


        var completed =
            execution.status === "completed";


        return global.PacemakerReflectionModel.create({

            experience:
                input.experience || null,


            completed:
                completed,


            summary:
                completed
                    ? "Execution completed."
                    : "Execution pending.",


            learning:
                completed
                    ? "Previous action was completed successfully."
                    : "Action needs continuation.",


            nextStep:
                completed
                    ? "Continue next growth step."
                    : "Review current action."

        });

    }


    global.PacemakerReflectionEngine = {

        reflect:
            reflect

    };


}(window));