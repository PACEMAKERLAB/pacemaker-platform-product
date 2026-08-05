/**
 * PACEMAKER Platform
 * Context Manager
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Manage Context lifecycle
 */

(function (global) {

    "use strict";


    function create(input) {


        var context =
            global.PacemakerContextModel.create(
                input
            );


        global.PacemakerContextStorage.save(
            context
        );


        return context;

    }


    function get() {


        return global.PacemakerContextStorage.load();

    }


    function update(data) {


        var current =
            get();


        if (!current) {

            return create(data);

        }


        var updated = {

            ...current,

            ...data

        };


        global.PacemakerContextStorage.save(
            updated
        );


        return updated;

    }


    function clear() {


        global.PacemakerContextStorage.clear();

    }


    global.PacemakerContextManager = {

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