/**
 * PACEMAKER Platform
 * Action Renderer
 * Version 1.0.1
 */

(function (global) {

    "use strict";

    function render(language) {

        language =
            language || {};

        var app =
            document.getElementById(
                "action-experience"
            );

        if (!app) {

            return;

        }

        app.innerHTML =

            "<h1>" +
            (language.title || "Action") +
            "</h1>" +

            "<p>" +
            (
                language.message ||
                language.description ||
                ""
            ) +
            "</p>" +

            "<button id=\"action-continue\" type=\"button\">" +
            (language.button || "CONTINUE") +
            "</button>";

    }

    global.PacemakerActionRenderer = {

        render: render

    };

}(window));