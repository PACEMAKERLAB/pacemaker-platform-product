/**
 * PACEMAKER Platform
 * Experience Session State
 *
 * Sprint 190
 * Version 1.2.0
 *
 * Responsibility
 * - Manage session current state
 * - Store continue navigation state
 */

(function(global){

    "use strict";


    function update(session, result){


        session.latestResult =
            result;



        session.currentStage =
            result.experience || null;



        var flowResult = null;



        if(
            global.PacemakerFlowRuntime
            &&
            result.experience
        ){

            flowResult =

                global.PacemakerFlowRuntime.execute({

                    experience:
                        result.experience

                });

        }



        session.continue = {


            nextStep:

                flowResult
                ?
                flowResult.next
                :
                null,



            route:

                flowResult
                ?
                flowResult.route
                :
                null


        };



        return session;


    }



    global.PacemakerExperienceSessionState = {


        update:

            update


    };


}(window));