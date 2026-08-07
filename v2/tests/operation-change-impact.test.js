/** PACEMAKER Platform Product v2 - Operation Change Impact Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function confirmedProtocol() {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001",
            protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture,
            createdAt: "2026-08-07T18:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var session = runtime.open(draft, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-CHG-001", at: "2026-08-07T18:01:00.000Z"
        });
        ["lifecycleStages", "requirementRules", "externalActions", "gaps"].forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section, expertId: "USR-EXPERT-0001", historyEventId: "HST-CHG-01" + index,
                at: "2026-08-07T18:1" + index + ":00.000Z"
            });
        });
        return runtime.confirm(session, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-CHG-020", at: "2026-08-07T18:20:00.000Z"
        }).protocol;
    }

    function analysisWithPlannedCount(analysis, unitProjectId, plannedCount) {
        var changed = global.PacemakerV2.Operation.Model.clone(analysis);
        changed.unitProjects.forEach(function (unitProject) {
            if (unitProject.unitProjectId === unitProjectId) {
                unitProject.plannedCount = plannedCount;
                unitProject.occurrenceDates = unitProject.occurrenceDates.slice(0, plannedCount);
            }
        });
        return changed;
    }

    function run() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var protocol = confirmedProtocol();
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var operation = global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger.merge({
            operationId: "OPR-2026-0001", confirmedProtocol: protocol,
            analysisResult: analysis, protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001", createdAt: "2026-08-07T18:30:00.000Z"
        });
        var proposed = analysisWithPlannedCount(analysis, "UNT-001", 2);
        var impact = global.PacemakerV2.Engine.OperationChange.ImpactAnalyzer.analyze({
            changeImpactId: "CIM-2026-0001", currentOperation: operation,
            proposedAnalysisResult: proposed, confirmedProtocol: protocol,
            executionState: global.PacemakerV2CommunityExecutionStateFixture,
            requestedChange: { unitProjectId: "UNT-001", field: "plannedCount", before: 3, after: 2 },
            analyzedAt: "2026-08-07T18:40:00.000Z", analyzedBy: "USR-EXPERT-0001"
        });
        var changed = global.PacemakerV2.Engine.OperationChange.ChangeConfirmer.confirm({
            currentOperation: operation, proposedAnalysisResult: proposed, changeImpact: impact,
            changeRequestId: "CRQ-2026-0001", reason: "여름호 대체 사업 추진",
            confirmedAt: "2026-08-07T18:45:00.000Z", confirmedBy: "USR-EXPERT-0001"
        });
        var protectedProposal = analysisWithPlannedCount(analysis, "UNT-002", 5);
        var protectedImpact = global.PacemakerV2.Engine.OperationChange.ImpactAnalyzer.analyze({
            changeImpactId: "CIM-2026-0002", currentOperation: operation,
            proposedAnalysisResult: protectedProposal, confirmedProtocol: protocol,
            executionState: global.PacemakerV2CommunityExecutionStateFixture,
            requestedChange: { unitProjectId: "UNT-002", field: "plannedCount", before: 12, after: 5 },
            analyzedAt: "2026-08-07T18:50:00.000Z", analyzedBy: "USR-EXPERT-0001"
        });

        assert(impact.status === "ready_for_confirmation", "newsletter change must be confirmable");
        assert(impact.beforeRequirementCount === 25, "before count must be 25");
        assert(impact.afterRequirementCount === 24, "after count must be 24");
        assert(impact.removedAssignments.length === 1, "one newsletter assignment must be removed");
        assert(impact.removedAssignments[0].occurrenceId === "UNT-001-R003", "newsletter round 3 must be removed");
        assert(changed.status === "changed", "confirmed change must set changed status");
        assert(changed.unitProjects[0].plannedCount === 2, "confirmed plan count must be 2");
        assert(protectedImpact.status === "manual_review_required", "completed occurrence removal must require review");
        assert(protectedImpact.protectedAssignments.length > 0, "completed requirements must be protected");

        return {
            passed: true,
            impactStatus: impact.status,
            beforeRequirementCount: impact.beforeRequirementCount,
            afterRequirementCount: impact.afterRequirementCount,
            removedOccurrenceId: impact.removedAssignments[0].occurrenceId,
            instructorOccurrenceCount: changed.requirementAssignments.filter(function (item) {
                return item.requirementRuleId === "DRR-INSTRUCTOR-001";
            }).length,
            confirmedOperationStatus: changed.status,
            protectedChangeStatus: protectedImpact.status,
            protectedAssignmentCount: protectedImpact.protectedAssignments.length
        };
    }

    global.PacemakerV2OperationChangeImpactTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
