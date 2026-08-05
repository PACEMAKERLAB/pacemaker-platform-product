/**
 * PACEMAKER Platform
 * Action Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Recommendation into Action
 */

(function (global) {

    "use strict";


    function create(input) {


        var recommendation =
            input.recommendation || {};


        var task =
            recommendation.recommendation ||
            "Start next action.";


        return global.PacemakerActionModel.create({

            experience:
                input.experience || null,


            task:
                task,


            status:
                "ready",


            priority:
                recommendation.priority ||
                "normal",


            source:
                "recommendation"

        });

    }


    global.PacemakerActionEngine = {

        create:
            create

    };


}(window));