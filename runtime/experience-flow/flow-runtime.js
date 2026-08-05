/**
 * PACEMAKER Platform
 * Experience Flow Runtime
 *
 * Version 1.1.0
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


        var gatewayResult =
            null;


        if (
            global.PacemakerExperienceGatewayRuntime
            &&
            next
        ) {


            gatewayResult =
                global.PacemakerExperienceGatewayRuntime.execute({

                    experience:
                        next,

                    stage:
                        next,

                    userInput:
                    {
                        source:
                            "flow"
                    }

                });

        }


        return {

            flow:
                model,

            gateway:
                gatewayResult

        };

    }


    global.PacemakerFlowRuntime = {

        execute:
            execute

    };


}(window));