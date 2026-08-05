/**
 * PACEMAKER Platform
 * Result Renderer
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Render Result to DOM
 */

(function (global) {

    "use strict";


    function render(result) {


        var target =
            document.getElementById(
                "pacemaker-result"
            );


        if (!target) {

            return;

        }


        target.innerHTML = `

            <section>

                <h1>
                    ${result.title}
                </h1>


                <p>
                    ${result.summary}
                </p>


                <p>
                    Next Step:
                    ${result.nextStep}
                </p>


                <strong>
                    Status:
                    ${result.status}
                </strong>

            </section>

        `;

    }


    global.PacemakerResultRenderer = {

        render:
            render

    };


}(window));