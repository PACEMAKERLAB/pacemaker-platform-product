/**
 * PACEMAKER Platform
 * Execution Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Convert Action into Execution
 */

(function (global) {

    "use strict";


    function execute(input) {


        var action =
            input.action || {};


        return global.PacemakerExecutionModel.create({

            experience:
                input.experience || null,


            task:
                action.task ||
                "Execute next action.",


            status:
                "completed",


            result:
                "Execution completed.",


            source:
                "action"

        });

    }


    global.PacemakerExecutionEngine = {

        execute:
            execute

    };


}(window));