/**
 * PACEMAKER Platform
 * Platform Runtime
 *
 * Alpha Foundation
 * Version 1.0.0
 */

(function (global) {

    "use strict";


    function execute(input) {


    var experience =
        input.experience;


    if (!experience) {

        throw new Error(
            "PACEMAKER Platform Runtime: experience is required."
        );

    }


    var alpha =
        global.PacemakerAlphaEngine;


    if (!alpha) {

        throw new Error(
            "PACEMAKER Platform Runtime: Alpha Engine not found."
        );

    }


    var context =
        alpha.execute(
            input
        );


    return {

        platform:
            "PACEMAKER",

        experience:
            experience,

        alpha:
            context,

        status:
            "ready"

    };

}


    global.PacemakerPlatformRuntime = {

        execute:
            execute

    };


}(this));