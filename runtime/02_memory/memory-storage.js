/**
 * PACEMAKER Platform
 * Memory Storage
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Store Memory records
 * - Load Memory records
 */

(function (global) {

    "use strict";


    var STORAGE_KEY =
        "pacemaker_memory";


    function save(memory) {


        var list =
            load();


        list.push(
            memory
        );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(list)
        );


        return memory;

    }


    function load() {


        var data =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!data) {

            return [];

        }


        return JSON.parse(data);

    }


    function clear() {


        localStorage.removeItem(
            STORAGE_KEY
        );

    }


    global.PacemakerMemoryStorage = {

        save:
            save,

        load:
            load,

        clear:
            clear

    };


}(window));