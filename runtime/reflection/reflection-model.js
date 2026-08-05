/**
 * PACEMAKER Platform
 * Reflection Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Reflection structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            completed:
                input.completed || false,


            summary:
                input.summary || null,


            learning:
                input.learning || null,


            nextStep:
                input.nextStep || null,


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerReflectionModel = {

        create:
            create

    };


}(window));