/** PACEMAKER Platform Product v2 - Protocol Operation Merge Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function confirmedProtocol() {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001",
            protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture,
            createdAt: "2026-08-07T17:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var session = runtime.open(draft, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-MRG-001", at: "2026-08-07T17:01:00.000Z"
        });
        ["lifecycleStages", "requirementRules", "externalActions", "gaps"].forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section, expertId: "USR-EXPERT-0001", historyEventId: "HST-MRG-01" + index,
                at: "2026-08-07T17:1" + index + ":00.000Z"
            });
        });
        return runtime.confirm(session, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-MRG-020", at: "2026-08-07T17:20:00.000Z"
        }).protocol;
    }

    function run() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var operation = global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger.merge({
            operationId: "OPR-2026-0001",
            confirmedProtocol: confirmedProtocol(),
            analysisResult: analysis,
            protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001",
            createdAt: "2026-08-07T17:30:00.000Z"
        });
        var projectRules = operation.requirementAssignments.filter(function (item) { return item.scope === "project"; });
        var expenseRules = operation.requirementAssignments.filter(function (item) { return item.requirementRuleId === "DRR-EXPENSE-001"; });
        var instructorRules = operation.requirementAssignments.filter(function (item) { return item.requirementRuleId === "DRR-INSTRUCTOR-001"; });
        var selfActivityInstructorRules = instructorRules.filter(function (item) {
            return Number(item.occurrenceId.split("-R")[1]) > 8;
        });

        assert(operation.status === "draft", "merged Operation must remain draft");
        assert(operation.protocolReference.protocolVersion === "V001", "Operation must reference confirmed Protocol V001");
        assert(projectRules.length === 1, "project-wide grant rule must apply once");
        assert(expenseRules.length === 16, "per-expense rule must apply to all 16 draft occurrences");
        assert(instructorRules.length === 8, "instructor rule must apply only to 8 external instructor occurrences");
        assert(selfActivityInstructorRules.length === 0, "self activity occurrences must not receive instructor rule");
        assert(operation.externalActionAssignments.length === 2, "botame actions must remain external assignments");

        return {
            passed: true,
            operationId: operation.operationId,
            operationStatus: operation.status,
            protocolVersion: operation.protocolReference.protocolVersion,
            projectRuleCount: projectRules.length,
            expenseRuleCount: expenseRules.length,
            instructorOccurrenceCount: instructorRules.length,
            selfActivityInstructorRuleCount: selfActivityInstructorRules.length,
            externalActionCount: operation.externalActionAssignments.length,
            totalRequirementAssignmentCount: operation.requirementAssignments.length
        };
    }

    global.PacemakerV2ProtocolOperationMergeTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
