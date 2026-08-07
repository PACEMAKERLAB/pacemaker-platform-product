/** PACEMAKER Platform Product v2 - My Project Controller - Version 1.0.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.MyProject = experience.MyProject || {};

    function createConfirmedOperation() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var draft = global.PacemakerV2.Engine.OperationGeneration.DraftGenerator.generate({
            operationId: "OPR-2026-0001", analysisResult: analysis, protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001", createdAt: "2026-08-07T14:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.OperationReview;
        var session = runtime.open(draft, { expertId: "USR-EXPERT-0001", at: "2026-08-07T14:01:00.000Z" });

        session = runtime.edit(session, {
            section: "unitProjects", action: "update", itemId: "UNT-001",
            changes: { title: "가을호 소식지", plannedCount: 2 }, expertId: "USR-EXPERT-0001",
            at: "2026-08-07T14:02:00.000Z"
        });
        ["lifecycle", "unitProjects", "requiredDocuments", "approvedBudget"].forEach(function (section, index) {
            session = runtime.confirmSection(session, { section: section, expertId: "USR-EXPERT-0001", at: "2026-08-07T14:0" + (index + 3) + ":00.000Z" });
        });
        return runtime.confirm(session, { expertId: "USR-EXPERT-0001", at: "2026-08-07T14:10:00.000Z" }).operation;
    }

    function start(options) {
        var root = document.getElementById(options.rootId);
        var operation = createConfirmedOperation();
        var executionState = global.PacemakerV2CommunityExecutionStateFixture;
        var derivedWork = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: executionState.asOfDate });
        var state = {
            activeTab: "개요",
            view: global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(
                operation, derivedWork, executionState
            )
        };

        root.addEventListener("click", function (event) {
            var tab = event.target.closest("button[data-tab]");
            if (!tab) { return; }
            state.activeTab = tab.dataset.tab;
            experience.MyProject.Renderer.render(root, state);
        });

        experience.MyProject.Renderer.render(root, state);
    }

    experience.MyProject.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
