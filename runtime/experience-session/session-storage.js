/**
 * PACEMAKER Platform
 * Experience Session Storage
 *
 * Sprint 187
 */

(function(global){

    "use strict";


    var key =
        "pacemaker_experience_session";



    function save(session){


        localStorage.setItem(

            key,

            JSON.stringify(session)

        );


    }



    function load(){


        var data =

            localStorage.getItem(key);



        if(!data){

            return null;

        }



        return JSON.parse(data);


    }



    global.PacemakerExperienceSessionStorage = {


        save:
            save,


        load:
            load


    };


}(window));