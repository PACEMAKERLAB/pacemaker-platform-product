/**
 * PACEMAKER Platform
 * Platform Runtime
 *
 * Sprint 186
 * Version 1.0.0
 */

(function(global){

    "use strict";


    function execute(input){


        var experience =

            input.experience || "start";



        var pipeline =

            global
            .PacemakerExperienceRuntimeResolver
            .resolve(
                experience
            );



        if(!pipeline){

            return {

                error:
                    "Runtime pipeline not found"

            };

        }



        var executionResult =

            global
            .PacemakerRuntimePipelineExecutor
            .execute(

                pipeline.runtime,

                input

            );



        var result =

            global
            .PacemakerResultAggregator
            .aggregate(

                experience,

                executionResult

            );



        return {


            experience:

                experience,


            pipeline:

                pipeline.runtime,


            result:

                result


        };


    }



    global.PacemakerPlatformRuntime = {


        execute:

            execute


    };


}(window));