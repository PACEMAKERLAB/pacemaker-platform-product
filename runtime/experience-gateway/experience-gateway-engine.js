/**
 * PACEMAKER Platform
 * Experience Gateway Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Experience input for Alpha Engine
 */

(function (global) {

    "use strict";


    function process(input) {


        var gateway =
            global.PacemakerExperienceGatewayModel.create(
                input
            );


        return {

            experience:
                gateway.experience,


            stage:
                gateway.stage,


            input:
                gateway.userInput,


            source:
                gateway.source

        };

    }


    global.PacemakerExperienceGatewayEngine = {

        process:
            process

    };


}(window));