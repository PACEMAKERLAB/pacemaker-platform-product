/**
 * PACEMAKER Platform
 * Experience Navigation Runtime
 *
 * Version 1.2.0
 */

(function(global){

    "use strict";


    function execute(input){


        var experience =
            input.experience;


        console.log(
            "Navigation Input:",
            experience
        );



        var model =
            global.PacemakerNavigationModel.create({

                experience:
                    experience

            });



        console.log(
            "Navigation Model:",
            model
        );



        var route =
            global.PacemakerNavigationController.resolve(
                model.experience
            );



        console.log(
            "Navigation Route:",
            route
        );



        model.route =
            route;



        return {

    navigation:
        model,

    execute:

        global.PacemakerNavigationExecutor
        ? 
        global.PacemakerNavigationExecutor.go
        : null

};


    }



    global.PacemakerNavigationRuntime = {


        execute:

            execute


    };



}(window));