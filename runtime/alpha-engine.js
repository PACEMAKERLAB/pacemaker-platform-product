/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.1.0
 */

(function (global) {

    "use strict";


    function execute(input) {


        if (!input) {

            throw new Error(
                "PACEMAKER Alpha Engine: input is required."
            );

        }


        var context =
            global.PacemakerContextRuntime.create({

                experience:
                    input.experience || null

            });


        return {

            engine:
                "alpha",

            version:
                "1.1.0",

            context:
                context,

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(window));