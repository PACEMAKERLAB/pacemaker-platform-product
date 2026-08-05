/**
 * PACEMAKER Platform
 * Runtime Adapter
 *
 * Sprint 186
 * Version 1.0.1
 */

(function(global){

    "use strict";


    var runtimeMap = {


        context:
            "PacemakerContextRuntime",


        memory:
            "PacemakerMemoryRuntime",


        intelligence:
            "PacemakerIntelligenceRuntime",


        recommendation:
            "PacemakerRecommendationRuntime",


        action:
            "PacemakerActionRuntime",


        execution:
            "PacemakerExecutionRuntime",


        reflection:
            "PacemakerReflectionRuntime",


        growth:
            "PacemakerGrowthRuntime",


        "memory-update":
            "PacemakerMemoryUpdateRuntime",


        persistence:
            "PacemakerPersistenceRuntime",


        result:
            "PacemakerResultRuntime"


    };



    function resolve(runtimeName){


        var objectName =
            runtimeMap[runtimeName];


        if(!objectName){

            return null;

        }


        var runtime =
            global[objectName];


        if(!runtime){

            return null;

        }


        return {


            execute:

                function(input){


                    if(
                        typeof runtime.execute === "function"
                    ){

                        return runtime.execute(input);

                    }


                    if(
                        typeof runtime.grow === "function"
                    ){

                        return runtime.grow(input);

                    }


                    return {


                        runtime:
                            runtimeName,


                        status:
                            "connected"


                    };


                }


        };


    }



    global.PacemakerRuntimeAdapter = {


        resolve:
            resolve


    };


}(window));