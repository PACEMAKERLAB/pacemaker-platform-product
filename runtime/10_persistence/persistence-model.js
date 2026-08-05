/**
 * PACEMAKER Platform
 * Persistence Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define persistence data structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            id:
                input.id ||
                (
                    "experience-" +
                    Date.now()
                ),


            experience:
                input.experience || null,


            type:
                input.type || "growth",


            learning:
                input.learning || null,


            nextStep:
                input.nextStep || null,


            data:
                input.data || {},


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerPersistenceModel = {

        create:
            create

    };


}(window));