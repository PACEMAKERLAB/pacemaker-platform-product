/**
 * PACEMAKER Platform
 * Result Experience Entry
 *
 * Sprint 191
 */

(function(global){

    "use strict";


    function execute(input){


        return global
            .PacemakerResultExperienceRuntime
            .execute(input);


    }



    global.PacemakerResultExperience = {


        execute:

            execute


    };


}(window));