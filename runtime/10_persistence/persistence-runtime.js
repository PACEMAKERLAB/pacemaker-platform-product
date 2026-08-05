/**
 * PACEMAKER Platform
 * Persistence Runtime
 *
 * Version 1.0.0
 *
 * Responsibility
 * - Execute persistence flow
 * - Connect Persistence Engine
 */

(function (global) {

    "use strict";


    function save(input) {


        return global.PacemakerPersistenceEngine.save(
            input
        );

    }


    function latest() {


        return global.PacemakerPersistenceEngine.latest();

    }


    global.PacemakerPersistenceRuntime = {

        save:
            save,


        latest:
            latest

    };


}(window));