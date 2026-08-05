/**
 * PACEMAKER Platform
 * Experience Flow Runtime
 *
 * Sprint 188
 * Version 1.2.0
 *
 * Responsibility
 * - Resolve next Experience
 * - Provide navigation flow
 */

(function(global){

    "use strict";


    function execute(input){


        var model =
            global.PacemakerFlowModel.create(
                input
            );



        var next =
            global.PacemakerFlowController.next(
                model.experience
            );



        model.next =
            next;



        return {


            experience:

                model.experience,


            next:

                next,


            route:

                next

                ?

                "experience/" +
                next +
                ".html"

                :

                null


        };


    }



    global.PacemakerFlowRuntime = {


        execute:

            execute


    };


}(window));