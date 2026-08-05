/**
 * PACEMAKER Platform
 * Context Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute Context flow
 * - Connect Context Manager
 */

(function (global) {

    "use strict";


    function create(input) {


        return global.PacemakerContextManager.create(
            input
        );

    }


    function get() {


        return global.PacemakerContextManager.get();

    }


    function update(data) {


        return global.PacemakerContextManager.update(
            data
        );

    }


    function clear() {


        return global.PacemakerContextManager.clear();

    }


    global.PacemakerContextRuntime = {

        create:
            create,

        get:
            get,

        update:
            update,

        clear:
            clear

    };


}(window));