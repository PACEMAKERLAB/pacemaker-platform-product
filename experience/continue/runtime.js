/**
 * PACEMAKER Platform
 * Continue Experience Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Resume previous Experience
 */

(function(global){

    "use strict";


    function execute(){


        var state =
            global
            .PacemakerExperienceContinueRuntime
            .resume();



        var target =
            document.getElementById(
                "pacemaker-continue"
            );



        if(target){


            if(state.available){


                target.innerHTML = `


                <section>


                <h1>
                Continue
                </h1>


                <p>
                이전 실행 과정을 이어갈 수 있습니다.
                </p>


                <p>
                Current Stage:
                ${state.currentStage}
                </p>


                <strong>
                Ready
                </strong>


                </section>


                `;


            } else {


                target.innerHTML = `


                <section>

                <h1>
                Continue
                </h1>


                <p>
                이어갈 실행 기록이 없습니다.
                </p>


                </section>


                `;


            }


        }



        return state;


    }



    global.PacemakerContinueRuntime = {


        execute:
            execute


    };



}(window));