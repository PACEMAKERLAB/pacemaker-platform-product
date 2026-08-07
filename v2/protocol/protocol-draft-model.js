/** PACEMAKER Platform Product v2 - Protocol Draft Model - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function create(input) {
        return {
            schemaVersion: protocol.DraftSchema.version,
            protocolDraftId: input.protocolDraftId,
            protocolId: input.protocolId || null,
            protocolVersion: null,
            status: protocol.DraftSchema.status.DRAFT,
            domain: clone(input.domain || {}),
            sourceAssetIds: clone(input.sourceAssetIds || []),
            lifecycleStages: clone(input.lifecycleStages || []),
            requirementRules: clone(input.requirementRules || []),
            externalActions: clone(input.externalActions || []),
            conflicts: clone(input.conflicts || []),
            gaps: clone(input.gaps || []),
            generatedBy: clone(input.generatedBy || {}),
            createdAt: input.createdAt,
            updatedAt: input.createdAt
        };
    }

    protocol.DraftModel = Object.freeze({ create: create, clone: clone });
}(typeof globalThis !== "undefined" ? globalThis : this));
