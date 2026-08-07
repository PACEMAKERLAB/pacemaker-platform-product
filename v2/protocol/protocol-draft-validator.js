/** PACEMAKER Platform Product v2 - Protocol Draft Validator - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;

    function validate(draft) {
        var errors = [];
        var evidenceIds = {};

        if (!draft || typeof draft !== "object") {
            return { valid: false, errors: ["protocol draft must be an object"] };
        }

        ["protocolDraftId", "status", "domain", "sourceAssetIds", "lifecycleStages", "requirementRules"].forEach(function (field) {
            if (!Object.prototype.hasOwnProperty.call(draft, field)) {
                errors.push(field + " is required");
            }
        });

        if (!draft.domain || !draft.domain.programName) {
            errors.push("domain.programName must not be empty");
        }

        (draft.sourceEvidences || []).forEach(function (evidence) {
            evidenceIds[evidence.sourceEvidenceId] = true;
        });

        (draft.requirementRules || []).forEach(function (rule, index) {
            if (!rule.requirementRuleId || !rule.title || !rule.stageCode || !rule.timing) {
                errors.push("requirementRules[" + index + "] has missing identity or scope");
            }
            if (rule.obligation === "conditional" && !rule.condition) {
                errors.push("requirementRules[" + index + "] conditional rule requires condition");
            }
            if (!rule.sourceEvidenceIds || rule.sourceEvidenceIds.length === 0) {
                errors.push("requirementRules[" + index + "] requires source evidence");
            }
        });

        return { valid: errors.length === 0, errors: errors };
    }

    protocol.DraftValidator = Object.freeze({ validate: validate });
}(typeof globalThis !== "undefined" ? globalThis : this));
