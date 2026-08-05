/**
 * PACEMAKER Platform
 * Experience Navigation Executor
 *
 * Sprint 194
 * Version 1.0.0
 */

(function(global){

    "use strict";


    function go(route){


        if(!route){

            return {

                moved:false

            };

        }


        window.location.href =
            "/" + route;



        return {

            moved:true,

            route:route

        };


    }



    global.PacemakerNavigationExecutor = {


        go:
            go


    };


}(window));