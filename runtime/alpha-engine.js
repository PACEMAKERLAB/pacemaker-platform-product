/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Sprint 186
 */

(function(global){

"use strict";


function execute(input){


    return (

        global
        .PacemakerPlatformRuntime
        .execute(

            input

        )

    );


}


global.PacemakerAlphaEngine = {


    execute:
        execute


};


}(window));