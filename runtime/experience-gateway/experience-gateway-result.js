/**
 * PACEMAKER Platform
 * Experience Gateway Result
 *
 * Sprint 187
 * Version 1.0.0
 *
 * Responsibility
 * - Normalize Gateway Result
 */

(function(global){

    "use strict";


    function create(gatewayResult){


        var alpha =
            gatewayResult.alpha;


        var executionResult =

    alpha.result;



        return {


            experience:

                gatewayResult.gateway.experience,



            request:{


                stage:

                    gatewayResult.gateway.stage,


                input:

                    gatewayResult.gateway.input,


                source:

                    gatewayResult.gateway.source


            },



            result:{


    status:

        "completed",


    title:

        "PACEMAKER Experience Result",


    summary:

        "Experience execution completed.",


    nextStep:

        "continue"


},



            metadata:{


                pipeline:

                    alpha.pipeline,


                executed:

                    alpha.result.executed


            }


        };


    }



    global.PacemakerExperienceGatewayResult = {


        create:

            create


    };


}(window));