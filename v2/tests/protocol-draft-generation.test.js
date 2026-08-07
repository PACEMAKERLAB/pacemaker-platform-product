/** PACEMAKER Platform Product v2 - Protocol Draft Generation Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function run() {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId: "PTD-COMMUNITY-2026-001",
            protocolId: "PTC-COMMUNITY-001",
            manualAnalysisResult: global.PacemakerV2CommunityManualAnalysisFixture,
            createdAt: "2026-08-07T15:00:00.000Z"
        });
        var validation = global.PacemakerV2.Protocol.DraftValidator.validate(draft);
        var instructorRule = draft.requirementRules.find(function (rule) {
            return rule.requirementRuleId === "DRR-INSTRUCTOR-001";
        });

        assert(validation.valid, validation.errors.join(", "));
        assert(draft.status === "draft", "generated protocol must remain draft");
        assert(draft.protocolVersion === null, "draft must not have confirmed version");
        assert(instructorRule.obligation === "conditional", "instructor evidence must be conditional");
        assert(instructorRule.condition.values.indexOf("instructor_fee") !== -1, "condition must target instructor fee");
        assert(draft.externalActions[0].service === "botame", "botame must remain an external action");
        assert(draft.sourceEvidences.length === 3, "source evidence must remain traceable");

        return {
            passed: true,
            protocolDraftId: draft.protocolDraftId,
            status: draft.status,
            lifecycleStageCount: draft.lifecycleStages.length,
            requirementRuleCount: draft.requirementRules.length,
            conditionalRuleCount: draft.requirementRules.filter(function (rule) { return rule.obligation === "conditional"; }).length,
            externalActionCount: draft.externalActions.length,
            sourceEvidenceCount: draft.sourceEvidences.length,
            gapCount: draft.gaps.length
        };
    }

    global.PacemakerV2ProtocolDraftGenerationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
