/**
 * PACEMAKER Platform Product v2
 * Operation Model
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function create(input) {
        var source = input || {};
        var now = source.now || new Date().toISOString();

        return {
            schemaVersion: "1.0.0",
            operationId: source.operationId || "",
            projectId: source.projectId || "",
            title: source.title || "",
            status: namespace.Schema.status.DRAFT,
            currentVersion: null,
            sourceAssetIds: clone(source.sourceAssetIds || []),
            protocolRecommendation: clone(source.protocolRecommendation || null),
            lifecycle: clone(source.lifecycle || []),
            unitProjects: clone(source.unitProjects || []),
            requiredDocuments: clone(source.requiredDocuments || []),
            budget: clone(source.budget || { approved: [], used: [] }),
            review: {
                requestedAt: null,
                reviewedAt: null,
                reviewerId: null,
                notes: [],
                sectionConfirmations: {
                    lifecycle: false,
                    unitProjects: false,
                    requiredDocuments: false,
                    approvedBudget: false
                }
            },
            confirmation: {
                confirmedAt: null,
                confirmedBy: null
            },
            change: {
                changeRequestId: null,
                changedAt: null,
                changedBy: null,
                reason: null
            },
            createdAt: now,
            createdBy: source.createdBy || null,
            updatedAt: now,
            updatedBy: source.createdBy || null
        };
    }

    namespace.Model = Object.freeze({
        create: create,
        clone: clone
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
