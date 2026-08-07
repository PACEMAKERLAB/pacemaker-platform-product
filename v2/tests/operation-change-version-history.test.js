/** PACEMAKER Platform Product v2 - Operation Change Version History Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    function confirmedProtocol() {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001", protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture, createdAt: "2026-08-07T19:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var session = runtime.open(draft, { expertId: "USR-EXPERT-0001", historyEventId: "HST-VH-001", at: "2026-08-07T19:01:00.000Z" });
        ["lifecycleStages", "requirementRules", "externalActions", "gaps"].forEach(function (section, index) {
            session = runtime.confirmSection(session, { section: section, expertId: "USR-EXPERT-0001", historyEventId: "HST-VH-01" + index, at: "2026-08-07T19:1" + index + ":00.000Z" });
        });
        return runtime.confirm(session, { expertId: "USR-EXPERT-0001", historyEventId: "HST-VH-020", at: "2026-08-07T19:20:00.000Z" }).protocol;
    }
    function run() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var protocol = confirmedProtocol();
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var v1 = global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger.merge({
            operationId: "OPR-2026-0001", confirmedProtocol: protocol, analysisResult: analysis,
            protocolRecommendation: recommendation, createdBy: "USR-EXPERT-0001", createdAt: "2026-08-07T19:30:00.000Z"
        });
        v1.status = "confirmed"; v1.currentVersion = "V001";
        v1.confirmation = { confirmedAt: "2026-08-07T19:35:00.000Z", confirmedBy: "USR-EXPERT-0001" };
        var proposed = global.PacemakerV2.Operation.Model.clone(analysis);
        proposed.unitProjects[0].plannedCount = 2;
        proposed.unitProjects[0].occurrenceDates = proposed.unitProjects[0].occurrenceDates.slice(0, 2);
        var impact = global.PacemakerV2.Engine.OperationChange.ImpactAnalyzer.analyze({
            changeImpactId: "CIM-2026-0001", currentOperation: v1, proposedAnalysisResult: proposed,
            confirmedProtocol: protocol, executionState: global.PacemakerV2CommunityExecutionStateFixture,
            requestedChange: { unitProjectId: "UNT-001", field: "plannedCount", before: 3, after: 2 },
            analyzedAt: "2026-08-07T19:40:00.000Z", analyzedBy: "USR-EXPERT-0001"
        });
        var result = global.PacemakerV2.Runtime.OperationChange.confirm({
            currentOperation: v1, proposedAnalysisResult: proposed, changeImpact: impact,
            changeRequestId: "CRQ-2026-0001", reason: "여름호 대체 사업 추진",
            confirmedAt: "2026-08-07T19:45:00.000Z", confirmedBy: "USR-EXPERT-0001"
        });
        assert(result.operation.status === "confirmed", "V002 must become confirmed current Operation");
        assert(result.operation.currentVersion === "V002", "change confirmation must create V002");
        assert(result.previousVersions.length === 1 && result.previousVersions[0].version === "V001", "V001 must be preserved");
        assert(result.previousVersions[0].snapshot.requirementAssignments.length === 25, "V001 snapshot must retain 25 requirements");
        assert(result.operation.requirementAssignments.length === 24, "V002 must contain 24 requirements");
        assert(result.historyEvents.length === 2, "change must create two history events");
        assert(result.historyEvents[0].changeImpactId === "CIM-2026-0001", "history must link impact analysis");
        assert(result.historyEvents[1].details.previousVersion === "V001", "version event must record previous version");
        return { passed:true, previousVersion:result.previousVersions[0].version, currentVersion:result.operation.currentVersion,
            currentStatus:result.operation.status, v1RequirementCount:result.previousVersions[0].snapshot.requirementAssignments.length,
            v2RequirementCount:result.operation.requirementAssignments.length, historyEventCount:result.historyEvents.length,
            changeImpactLinked:result.historyEvents[0].changeImpactId === impact.changeImpactId };
    }
    global.PacemakerV2OperationChangeVersionHistoryTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
