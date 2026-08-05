/**
 * PACEMAKER Platform
 * Experience Session Query
 *
 * Sprint 187
 * Version 1.0.0
 *
 * Responsibility
 * - Query saved experience session
 */

(function(global){

    "use strict";


    function latest(){


        return (

            global
            .PacemakerExperienceSessionStorage
            .load()

        );


    }



    function status(session){


        if(!session){

            return null;

        }


        return {


            id:

                session.id,


            experience:

                session.experience,


            status:

                session.status,


            currentStage:

                session.currentStage || null


        };


    }



    global.PacemakerExperienceSessionQuery = {


        latest:

            latest,


        status:

            status


    };


}(window));