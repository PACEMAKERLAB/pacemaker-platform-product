/**
 * PACEMAKER Platform
 * Action Experience
 * Renderer
 * Version 1.0.0
 *
 * Responsibility
 * - Render the Action Experience language.
 */

(function (global) {

    "use strict";

    function render(language) {

        language =
            language || {};

        var root =
            document.getElementById(
                "action-experience"
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

        var button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.id =
            "action-continue-button";

        button.textContent =
            language.button || "";

        root.appendChild(title);
        root.appendChild(message);
        root.appendChild(button);

        return root;

    }

    global.PacemakerActionRenderer = {

        render: render

    };

}(window));