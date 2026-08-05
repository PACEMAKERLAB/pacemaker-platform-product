/**
 * PACEMAKER Platform
 * Memory Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Memory structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            id:
                "memory-" +
                Date.now(),


            experience:
                input.experience || null,


            type:
                input.type || "experience",


            data:
                input.data || {},


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerMemoryModel = {

        create:
            create

    };


}(window));