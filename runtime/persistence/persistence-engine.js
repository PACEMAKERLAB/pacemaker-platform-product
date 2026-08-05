/**
 * PACEMAKER Platform
 * Persistence Engine
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Save and load experience records
 */

(function (global) {

    "use strict";


    var STORAGE_KEY =
        "pacemaker_growth_history";


    function save(input) {


        var record =
            global.PacemakerPersistenceModel.create(
                input
            );


        var history =
            load();


        history.push(record);


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(history)
        );


        return record;

    }


    function load() {


        var raw =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!raw) {

            return [];

        }


        return JSON.parse(raw);

    }


    function latest() {


        var history =
            load();


        if (
            history.length === 0
        ) {

            return null;

        }


        return history[
            history.length - 1
        ];

    }


    global.PacemakerPersistenceEngine = {

        save:
            save,


        load:
            load,


        latest:
            latest

    };


}(window));