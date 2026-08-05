/**
 * PACEMAKER Platform
 * Runtime Pipeline Executor
 *
 * Sprint 186
 * Version 1.1.0
 */

(function(global){

    "use strict";


    function execute(

        pipeline,

        input

    ){


        var result = {


            input:

                input || {},


            executed:

                [],


            results:

                []


        };



        pipeline.forEach(

            function(runtimeName){



                var runtime =

                    global
                    .PacemakerRuntimeAdapter
                    .resolve(
                        runtimeName
                    );



                if(
                    runtime &&
                    typeof runtime.execute === "function"
                ){


                    var runtimeResult =

                        runtime.execute(

                            input

                        );



                    result.executed.push(

                        runtimeName

                    );



                    result.results.push(

                        runtimeResult

                    );


                }


            }

        );



        return result;


    }



    global.PacemakerRuntimePipelineExecutor = {


        execute:

            execute


    };


}(window));