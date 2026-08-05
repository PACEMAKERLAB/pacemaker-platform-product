/**
 * PACEMAKER Platform
 * Continue Runtime
 *
 * Sprint 187
 * Version 1.0.0
 *
 * Responsibility
 * - Resume Experience
 */

(function(global){

    "use strict";


    function resume(){


        var session =

            global
            .PacemakerExperienceSessionQuery
            .latest();



        if(!session){

            return {

                available:false

            };

        }



        return {


            available:true,


            sessionId:

                session.id,


            experience:

                session.experience,


            currentStage:

                session.currentStage,


            continue:

                session.continue,


            latestResult:

                session.latestResult


        };


    }



    global.PacemakerExperienceContinueRuntime = {


        resume:

            resume


    };


}(window));