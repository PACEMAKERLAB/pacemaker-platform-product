/**
 * PACEMAKER Platform
 * Experience Session Model
 *
 * Sprint 187
 * Version 1.0.0
 *
 * Responsibility
 * - Define Experience Session structure
 */

(function(global){

    "use strict";


    function create(input){


        return {


            id:

                "session-" +
                Date.now(),



            experience:

                input.experience || null,



            status:

                "started",



            startedAt:

                new Date().toISOString(),



            history:

                []

        };


    }



    global.PacemakerExperienceSessionModel = {


        create:

            create


    };


}(window));