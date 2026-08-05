/**
 * PACEMAKER Platform
 * Memory Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Memory flow
 * - Connect Memory Manager
 */

(function (global) {

    "use strict";


    function create(input) {


        return global.PacemakerMemoryManager.create(
            input
        );

    }


    function getAll() {


        return global.PacemakerMemoryManager.getAll();

    }


    function clear() {


        return global.PacemakerMemoryManager.clear();

    }


    global.PacemakerMemoryRuntime = {

        create:
            create,

        getAll:
            getAll,

        clear:
            clear

    };


}(window));