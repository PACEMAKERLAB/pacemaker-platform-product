/** PACEMAKER Platform Product v2 - Protocol Expert Review Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    function expectError(callback, message) { var failed = false; try { callback(); } catch (error) { failed = true; } assert(failed, message); }

    function run() {
        var generator = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator;
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var draft = generator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001",
            protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture,
            createdAt: "2026-08-07T16:00:00.000Z"
        });
        var session = runtime.open(draft, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-001", at: "2026-08-07T16:01:00.000Z"
        });

        session = runtime.edit(session, {
            section: "requirementRules", action: "add",
            item: global.PacemakerV2.Protocol.DocumentRequirementRuleModel.create({
                requirementRuleId: "DRR-GRANT-002", title: "청렴이행서약서", obligation: "required",
                stageCode: "plan_and_grant", timing: "before_project",
                appliesTo: { projectWide: true, unitProjectTypes: [], occurrenceScope: "none", expenseTypes: [] },
                document: { documentType: "integrity-pledge", templateRequired: true },
                submission: { destination: "보탬e", externalService: "botame", menuCode: "92016" },
                completionCriteria: ["작성 완료", "보탬e 첨부 완료"], sourceEvidenceIds: ["EVD-001"], confidence: 0.99
            }),
            expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-002", at: "2026-08-07T16:02:00.000Z"
        });

        session = runtime.edit(session, {
            section: "gaps", action: "update", itemId: "GAP-001",
            changes: { decision: "accepted_for_followup", decisionNote: "지출유형별 세부규칙 후속 분석" },
            expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-003", at: "2026-08-07T16:03:00.000Z"
        });

        expectError(function () {
            runtime.confirm(session, { expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-004", at: "2026-08-07T16:04:00.000Z" });
        }, "Protocol confirmation must be blocked before every section is reviewed");

        protocolSections().forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section, expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-01" + index,
                at: "2026-08-07T16:1" + index + ":00.000Z"
            });
        });

        var result = runtime.confirm(session, {
            expertId: "USR-EXPERT-0001", historyEventId: "HST-PTC-020", at: "2026-08-07T16:20:00.000Z"
        });
        assert(result.protocol.status === "confirmed", "Protocol must be confirmed");
        assert(result.protocol.protocolVersion === "V001", "first Protocol confirmation must create V001");
        assert(result.protocol.requirementRules.length === 4, "expert rule addition must remain");

        return {
            passed: true,
            protocolId: result.protocol.protocolId,
            status: result.protocol.status,
            version: result.protocol.protocolVersion,
            requirementRuleCount: result.protocol.requirementRules.length,
            reviewedSectionCount: protocolSections().length,
            historyEventCount: result.historyEvents.length
        };
    }

    function protocolSections() { return ["lifecycleStages", "requirementRules", "externalActions", "gaps"]; }
    global.PacemakerV2ProtocolExpertReviewTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
