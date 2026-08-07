/**
 * PACEMAKER Platform Product v2
 * Operation Review Policy
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    var SECTION = Object.freeze({
        LIFECYCLE: "lifecycle",
        UNIT_PROJECTS: "unitProjects",
        REQUIRED_DOCUMENTS: "requiredDocuments",
        APPROVED_BUDGET: "approvedBudget"
    });

    var EDITABLE_COLLECTION = Object.freeze({
        lifecycle: { path: "lifecycle", idField: "stageId" },
        unitProjects: { path: "unitProjects", idField: "unitProjectId" },
        requiredDocuments: { path: "requiredDocuments", idField: "documentType" },
        approvedBudget: { path: "budget.approved", idField: "categoryId" }
    });

    function allSectionsConfirmed(operation) {
        var confirmations = operation.review.sectionConfirmations;

        return Object.values(SECTION).every(function (section) {
            return confirmations[section] === true;
        });
    }

    namespace.ReviewPolicy = Object.freeze({
        section: SECTION,
        editableCollection: EDITABLE_COLLECTION,
        allSectionsConfirmed: allSectionsConfirmed
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
