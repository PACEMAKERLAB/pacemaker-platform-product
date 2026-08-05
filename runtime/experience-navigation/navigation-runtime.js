/**
 * PACEMAKER Platform
 * Experience Navigation Runtime
 *
 * Version 1.1.0
 */

(function(global){

    "use strict";


    function execute(input){


        var experience =
            input.experience;


        var model =
            global.PacemakerNavigationModel.create({

                experience:
                    experience

            });


        var route =
            global.PacemakerNavigationController.resolve(
                model.experience
            );


        model.route =
            route;


        return {

            navigation:
                model

        };


    }


    function fromFlow(flowResult){


        return execute({

            experience:
                flowResult.next

        });


    }


    global.PacemakerNavigationRuntime = {


        execute:
            execute,


        fromFlow:
            fromFlow


    };


}(window));