/**
 * PACEMAKER Platform
 * Memory Manager
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Manage Memory lifecycle
 */

(function (global) {

    "use strict";


    function create(input) {


        var memory =
            global.PacemakerMemoryModel.create(
                input
            );


        global.PacemakerMemoryStorage.save(
            memory
        );


        return memory;

    }


    function getAll() {


        return global.PacemakerMemoryStorage.load();

    }


    function clear() {


        global.PacemakerMemoryStorage.clear();

    }


    global.PacemakerMemoryManager = {

        create:
            create,

        getAll:
            getAll,

        clear:
            clear

    };


}(window));