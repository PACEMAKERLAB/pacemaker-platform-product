/**
 * PACEMAKER Platform
 * Start Experience
 * Runtime
 *
 * Responsibility
 * - Execute the Start Experience flow.
 */

(function (global) {

    "use strict";

    function execute(input) {

        var session =
            global.PacemakerExperienceSessionRuntime.start({
                experience:
                "start"

       });

       var gateway =

    global
    .PacemakerExperienceGatewayRuntime
    .execute({

        experience:
            "growth",


        stage:
            "start",


        userInput:
            input || {},


        source:
            "start-experience"

    });
       
        var model =
            global.PacemakerStartModel.create(
                input
            );

        var decision =
            global.PacemakerStartDecision.execute(
                model
            );

        var result =
            global.PacemakerStartGenerator.generate(
                decision,
                model
            );

        var language =
            global.PacemakerStartLanguage.create(
                result
            );

        global.PacemakerStartRenderer.render(
    language
);

session =

global
.PacemakerExperienceSessionRuntime
.appendResult(

    session,

    {

        experience:
            "start",

        result:
            result

    }

);

var next =

global
.PacemakerNavigationRuntime
.execute({

    experience:
        "understand"

});

return {

    status:
        "completed",

    session:
        session,

    gateway:
        gateway,

    result:
        result,

    nextStep:
        next

};

    }

    global.PacemakerStartRuntime = {

        execute: execute

    };

}(window));