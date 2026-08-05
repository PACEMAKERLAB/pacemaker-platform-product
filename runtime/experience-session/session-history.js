/**
 * PACEMAKER Platform
 * Experience Session History
 *
 * Sprint 187
 */

(function(global){

    "use strict";


    function append(session, item){


        session.history.push({

            ...item,


            createdAt:

                new Date()
                .toISOString()

        });


        return session;

    }



    function latest(session){


        if(
            !session.history.length
        ){

            return null;

        }


        return session.history[
            session.history.length - 1
        ];


    }



    global.PacemakerExperienceSessionHistory = {


        append:

            append,


        latest:

            latest


    };


}(window));