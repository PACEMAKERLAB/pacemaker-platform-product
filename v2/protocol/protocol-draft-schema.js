/** PACEMAKER Platform Product v2 - Protocol Draft Schema - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol = global.PacemakerV2.Protocol || {};

    protocol.DraftSchema = Object.freeze({
        version: "1.0.0",
        status: Object.freeze({
            DRAFT: "draft",
            IN_REVIEW: "in_review",
            CONFIRMED: "confirmed",
            ARCHIVED: "archived"
        }),
        requirementType: Object.freeze({
            DOCUMENT: "document",
            RECORD: "record",
            EXTERNAL_ACTION: "external_action"
        }),
        obligation: Object.freeze({
            REQUIRED: "required",
            CONDITIONAL: "conditional",
            RECOMMENDED: "recommended"
        }),
        timing: Object.freeze({
            BEFORE_PROJECT: "before_project",
            BEFORE_OCCURRENCE: "before_occurrence",
            ON_OCCURRENCE: "on_occurrence",
            AFTER_OCCURRENCE: "after_occurrence",
            PER_EXPENSE: "per_expense",
            AT_CLOSING: "at_closing"
        })
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
