/** PACEMAKER Platform Product v2 - Document Requirement Rule Model - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function create(input) {
        return {
            requirementRuleId: input.requirementRuleId,
            title: input.title,
            requirementType: input.requirementType || "document",
            obligation: input.obligation || "required",
            stageCode: input.stageCode,
            timing: input.timing,
            appliesTo: clone(input.appliesTo || {
                projectWide: true,
                unitProjectTypes: [],
                occurrenceScope: "none",
                expenseTypes: []
            }),
            condition: clone(input.condition || null),
            document: clone(input.document || null),
            submission: clone(input.submission || null),
            completionCriteria: clone(input.completionCriteria || []),
            sourceEvidenceIds: clone(input.sourceEvidenceIds || []),
            confidence: Number.isFinite(input.confidence) ? input.confidence : 0,
            reviewStatus: "ai_recommended"
        };
    }

    protocol.DocumentRequirementRuleModel = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
