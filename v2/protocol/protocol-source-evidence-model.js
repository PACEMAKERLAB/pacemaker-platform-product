/** PACEMAKER Platform Product v2 - Protocol Source Evidence Model - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;

    function create(input) {
        return {
            sourceEvidenceId: input.sourceEvidenceId,
            sourceAssetId: input.sourceAssetId,
            fileName: input.fileName,
            page: input.page || null,
            section: input.section || null,
            excerpt: input.excerpt || null,
            confidence: Number.isFinite(input.confidence) ? input.confidence : 0
        };
    }

    protocol.SourceEvidenceModel = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
