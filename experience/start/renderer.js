/**
 * PACEMAKER Platform
 * Start Experience
 * Renderer
 *
 * Responsibility
 * - Render the Start Experience language.
 */

(function (global) {

    "use strict";

    function render(language) {

        language =
            language || {};

        var root =
            document.getElementById(
                "start-experience"
            );

        if (!root) {

            return null;

        }

        root.innerHTML = "";

        var title =
            document.createElement(
                "h1"
            );

        title.textContent =
            language.title || "";

        var message =
            document.createElement(
                "p"
            );

        message.textContent =
            language.message || "";

        message.style.whiteSpace =
            "pre-line";

        var button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.textContent =
            language.button || "";

        button.id =
            "start-button";

        root.appendChild(
            title
        );

        root.appendChild(
            message
        );

        root.appendChild(
            button
        );

        return root;

    }

    global.PacemakerStartRenderer = {

        render: render

    };

}(window));