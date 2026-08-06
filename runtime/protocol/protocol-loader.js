/**
 * PACEMAKER Platform
 * Protocol Loader
 *
 * Sprint 192
 * Version 1.0.0
 *
 * Responsibility
 * - Load registered Protocol
 */

(function (global) {

    "use strict";

    function load(id) {

        switch (id) {

        case "community":

            return global.PacemakerCommunityProtocol;

        default:

            return null;

        }

    }

    global.PacemakerProtocolLoader = {

        load: load

    };

}(window));