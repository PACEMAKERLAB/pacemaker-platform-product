/**
 * PACEMAKER Platform
 * Experience Session Runtime
 *
 * Sprint 187
 * Version 1.1.0
 */

(function(global){

    "use strict";


    function start(input){


        var session =

            global
            .PacemakerExperienceSessionModel
            .create(
                input
            );


        global
        .PacemakerExperienceSessionStorage
        .save(
            session
        );


        return session;


    }



    function appendResult(
        session,
        result
    ){


        global
.PacemakerExperienceSessionHistory
.append(

    session,

    {

        type:"result",

        experience:
            result.experience,

        result:
            result.result

    }

);


global
.PacemakerExperienceSessionState
.update(

    session,

    result

);



        session.status =
            "completed";



        global
        .PacemakerExperienceSessionStorage
        .save(
            session
        );


        return session;


    }



    function execute(input){


        var session =

            start({

                experience:
                    input.experience

            });



        var gatewayResult =

            global
            .PacemakerExperienceGatewayRuntime
            .execute(
                input
            );



        var updatedSession =

            appendResult(

                session,

                gatewayResult.result

            );



        return {


            session:

                updatedSession,


            result:

                gatewayResult.result


        };


    }



    global.PacemakerExperienceSessionRuntime = {


        start:
            start,


        execute:
            execute,


        appendResult:
            appendResult


    };


}(window));