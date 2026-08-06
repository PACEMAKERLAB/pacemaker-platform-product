/**
 * PACEMAKER Platform
 * Continue Experience Runtime
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function execute(input) {

        input =
            input || {};

        var result = {

            experience:
                "continue",

            title:
                "Continue",

            message:
                "오늘의 과정을 마쳤습니다. 다음 여정에서 다시 이어갑니다.",

            status:
                "completed"

        };

        var target =
            document.getElementById(
                "pacemaker-continue"
            );

        if (target) {

            target.innerHTML =

                "<section>" +

                    "<h1>" +
                        result.title +
                    "</h1>" +

                    "<p>" +
                        result.message +
                    "</p>" +

                    "<strong>" +
                        "Status: " +
                        result.status +
                    "</strong>" +

                "</section>";

        }

        return {

            experience:
                "continue",

            status:
                "completed",

            result:
                result

        };

    }

    global.PacemakerContinueRuntime = {

        execute:
            execute

    };

}(window));