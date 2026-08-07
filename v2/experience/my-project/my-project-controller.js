/** PACEMAKER Platform Product v2 - My Project Controller - Version 1.0.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.MyProject = experience.MyProject || {};

    function start(options) {
        var root = document.getElementById(options.rootId);
        var versionState = global.PacemakerV2CommunityOperationV2Fixture.build("USR-EXPERT-0001");
        var operation = versionState.operation;
        var executionState = global.PacemakerV2CommunityExecutionStateFixture;
        var derivedWork = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: executionState.asOfDate });
        var state = {
            activeTab: "개요",
            showHistory: false,
            view: global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(
                operation, derivedWork, executionState, versionState
            ),
            planView: global.PacemakerV2.Engine.OperationProjection.PlanProjector.project(
                operation, derivedWork, executionState
            ),
            executionView: global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(
                operation, derivedWork, executionState
            )
        };

        root.addEventListener("click", function (event) {
            var tab = event.target.closest("button[data-tab]");
            var action = event.target.closest("button[data-action]");
            if (tab) { state.activeTab = tab.dataset.tab; }
            if (action && action.dataset.action === "toggle-history") {
                state.showHistory = !state.showHistory;
            }
            if (!tab && !action) { return; }
            experience.MyProject.Renderer.render(root, state);
        });

        experience.MyProject.Renderer.render(root, state);
    }

    experience.MyProject.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
