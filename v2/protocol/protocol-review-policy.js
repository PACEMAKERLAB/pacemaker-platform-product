/** PACEMAKER Platform Product v2 - Protocol Review Policy - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;
    protocol.ReviewPolicy = Object.freeze({
        sections: Object.freeze(["lifecycleStages", "requirementRules", "externalActions", "gaps"]),
        collections: Object.freeze({
            lifecycleStages: { idField: "stageCode" },
            requirementRules: { idField: "requirementRuleId" },
            externalActions: { idField: "externalActionId" },
            gaps: { idField: "gapId" }
        }),
        allSectionsConfirmed: function (draft) {
            return this.sections.every(function (section) {
                return draft.review.sectionConfirmations[section] === true;
            });
        }
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
