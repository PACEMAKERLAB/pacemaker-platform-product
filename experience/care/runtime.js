/**
 * PACEMAKER Platform
 * Care Experience Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Support user after result
 */

(function(global){

    "use strict";


    function execute(input){


        var session =
            input.session || {};



        var result = {

            experience:
                "care",


            title:
                "Care",


            message:
                "현재 과정을 확인하고 다음 실행을 준비합니다.",


            nextStep:
                "continue",


            status:
                "completed"


        };



        var target =
            document.getElementById(
                "pacemaker-care"
            );


        if(target){


            target.innerHTML = `

            <section>

            <h1>
            ${result.title}
            </h1>


            <p>
            ${result.message}
            </p>


            <strong>
            Status:
            ${result.status}
            </strong>


            </section>

            `;

        }



        return {

            session:
                session,


            result:
                result

        };


    }



    global.PacemakerCareRuntime = {

        execute:
            execute

    };


}(window));