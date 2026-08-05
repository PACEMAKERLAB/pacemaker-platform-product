/**
 * PACEMAKER Platform
 * Experience Gateway Runtime
 *
 * Version 1.1.0
 *
 * Responsibility
 * - Connect Experience and Alpha Engine
 */

(function (global) {

    "use strict";


    function execute(input) {


        var gateway =
            global.PacemakerExperienceGatewayEngine.process(
                input
            );


        var result =
            global.PacemakerAlphaEngine.execute({

                experience:
                    gateway.experience

            });


        return {

            gateway:
                gateway,

            alpha:
                result

        };

    }


    global.PacemakerExperienceGatewayRuntime = {

        execute:
            execute

    };


}(window));