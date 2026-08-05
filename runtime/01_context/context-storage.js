/**
 * PACEMAKER Platform
 * Context Storage
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Store Context data
 * - Load Context data
 * - Clear Context data
 */

(function (global) {

    "use strict";


    var STORAGE_KEY =
        "pacemaker_context";


    function save(context) {


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(context)
        );


        return context;

    }


    function load() {


        var data =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!data) {

            return null;

        }


        return JSON.parse(data);

    }


    function clear() {


        localStorage.removeItem(
            STORAGE_KEY
        );


    }


    global.PacemakerContextStorage = {

        save:
            save,

        load:
            load,

        clear:
            clear

    };


}(window));