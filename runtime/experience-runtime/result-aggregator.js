/**
 * PACEMAKER Platform
 * Runtime Result Aggregator
 *
 * Sprint 186
 * Version 1.0.0
 */

(function(global){

    "use strict";


    function aggregate(

        experience,

        executionResult

    ){


        var result = {


            experience:

                experience,


            status:

                "completed",


            executed:

                executionResult.executed,


            runtimeResults:

                {},


            finalResult:

                null


        };



        executionResult.executed.forEach(

            function(runtimeName, index){


                result.runtimeResults[runtimeName] =

                    executionResult.results[index];


            }

        );



        if(
            result.runtimeResults.result
        ){

            result.finalResult =

                result.runtimeResults.result;

        }



        return result;


    }



    global.PacemakerResultAggregator = {


        aggregate:

            aggregate


    };


}(window));