/**
 * PACEMAKER Platform
 * Experience Runtime Resolver
 *
 * Sprint 186
 * Version 1.1.0
 */

(function(global){

    "use strict";


    function resolve(experience){


        var mapping =
            global
            .PacemakerExperienceRuntimeMapping
            .get(
                experience
            );


        if(!mapping){

            return null;

        }


        return {


            experience:

                experience,


            runtime:

                mapping.runtime


        };


    }


    global.PacemakerExperienceRuntimeResolver = {


        resolve:
            resolve


    };


}(window));