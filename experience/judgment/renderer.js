/**
 * PACEMAKER Platform
 * Judgment Renderer
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    function render(language) {

        var app =
            document.getElementById(
                "judgment-experience"
            );

        if (!app) {

            return;

        }

        app.innerHTML =

            "<h1>" +
            language.title +
            "</h1>" +

            "<p>" +
            language.description +
            "</p>";

    }

    global.PacemakerJudgmentRenderer = {

        render: render

    };

}(this));