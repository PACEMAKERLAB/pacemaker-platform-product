/** PACEMAKER Platform Product v2 - Operation Change Review Controller - Version 1.0.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.OperationChangeReview = experience.OperationChangeReview || {};

    function confirmedProtocol(expertId) {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001", protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture,
            createdAt: "2026-08-07T18:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var session = runtime.open(draft, { expertId: expertId, historyEventId: "HST-UI-001", at: new Date().toISOString() });
        ["lifecycleStages", "requirementRules", "externalActions", "gaps"].forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section, expertId: expertId, historyEventId: "HST-UI-01" + index, at: new Date().toISOString()
            });
        });
        return runtime.confirm(session, {
            expertId: expertId, historyEventId: "HST-UI-020", at: new Date().toISOString()
        }).protocol;
    }

    function createState(expertId) {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var protocol = confirmedProtocol(expertId);
        var operation = global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger.merge({
            operationId: "OPR-2026-0001", confirmedProtocol: protocol, analysisResult: analysis,
            protocolRecommendation: recommendation, createdBy: expertId, createdAt: new Date().toISOString()
        });
        operation.status = global.PacemakerV2.Operation.Schema.status.CONFIRMED;
        operation.currentVersion = "V001";
        operation.confirmation = { confirmedAt: "2026-08-07T18:30:00.000Z", confirmedBy: expertId };
        var proposed = global.PacemakerV2.Operation.Model.clone(analysis);
        proposed.unitProjects[0].plannedCount = 2;
        proposed.unitProjects[0].occurrenceDates = proposed.unitProjects[0].occurrenceDates.slice(0, 2);
        var impact = global.PacemakerV2.Engine.OperationChange.ImpactAnalyzer.analyze({
            changeImpactId: "CIM-2026-0001", currentOperation: operation,
            proposedAnalysisResult: proposed, confirmedProtocol: protocol,
            executionState: global.PacemakerV2CommunityExecutionStateFixture,
            requestedChange: { unitProjectId: "UNT-001", title: "마을 소식지", field: "plannedCount", before: 3, after: 2 },
            analyzedAt: new Date().toISOString(), analyzedBy: expertId
        });
        return { expertId: expertId, operation: operation, proposedAnalysis: proposed, impact: impact,
            previousVersions: [], historyEvents: [], completed: false, error: null };
    }

    function start(options) {
        var root = document.getElementById(options.rootId);
        var state = createState(options.expertId);
        function render() { experience.OperationChangeReview.Renderer.render(root, state); }
        root.addEventListener("click", function (event) {
            var button = event.target.closest("button[data-action]");
            if (!button) { return; }
            if (button.dataset.action === "back") {
                state.error = "수정안으로 돌아가기가 선택되었습니다. 실제 제품에서는 Operation 수정 화면으로 이동합니다.";
            }
            if (button.dataset.action === "confirm") {
                try {
                    var result = global.PacemakerV2.Runtime.OperationChange.confirm({
                        currentOperation: state.operation, proposedAnalysisResult: state.proposedAnalysis,
                        changeImpact: state.impact, changeRequestId: "CRQ-2026-0001",
                        reason: "여름호 대체 사업 추진을 위한 소식지 계획 변경",
                        confirmedAt: new Date().toISOString(), confirmedBy: state.expertId,
                        previousVersions: state.previousVersions, historyEvents: state.historyEvents
                    });
                    state.operation = result.operation;
                    state.previousVersions = result.previousVersions;
                    state.historyEvents = result.historyEvents;
                    state.completed = true;
                    state.error = null;
                } catch (error) { state.error = error.message; }
            }
            render();
        });
        render();
    }

    experience.OperationChangeReview.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
