/**
 * PACEMAKER Platform
 * Experience Navigation Test
 *
 * Sprint 185
 */


(function(global){

    "use strict";


    function run(){


        var stages = [

            "start",
            "understand",
            "thinking",
            "action",
            "growth",
            "care",
            "continue"

        ];


        var results = [];


        stages.forEach(function(stage){


            var flow =
                global.PacemakerFlowRuntime.execute({

                    experience:
                        stage,

                    stage:
                        stage

                });


            var navigation =
                global.PacemakerNavigationRuntime.fromFlow(

                    flow.flow

                );


            results.push({

                current:
                    stage,

                next:
                    flow.flow.next,

                route:
                    navigation.navigation.route

            });


        });


        console.log(

            "Navigation Test",

            results

        );


        return results;

    }


    global.PacemakerNavigationTest = {

        run:
            run

    };


}(window));