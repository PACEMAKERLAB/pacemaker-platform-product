/**
 * PACEMAKER Platform
 * Experience Gateway Model
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Define Experience Gateway input structure
 */

(function (global) {

    "use strict";


    function create(input) {


        return {

            experience:
                input.experience || null,


            stage:
                input.stage || null,


            userInput:
                input.userInput || {},


            source:
                input.source || "experience",


            createdAt:
                new Date().toISOString()

        };

    }


    global.PacemakerExperienceGatewayModel = {

        create:
            create

    };


}(window));