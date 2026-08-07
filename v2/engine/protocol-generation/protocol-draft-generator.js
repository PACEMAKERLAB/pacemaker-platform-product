/** PACEMAKER Platform Product v2 - Protocol Draft Generator - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.ProtocolGeneration = engine.ProtocolGeneration || {};

    function generate(input) {
        var analysis = input.manualAnalysisResult;
        var evidences = (analysis.sourceEvidences || []).map(function (item) {
            return global.PacemakerV2.Protocol.SourceEvidenceModel.create(item);
        });
        var rules = (analysis.requirementRules || []).map(function (item) {
            return global.PacemakerV2.Protocol.DocumentRequirementRuleModel.create(item);
        });
        var draft = global.PacemakerV2.Protocol.DraftModel.create({
            protocolDraftId: input.protocolDraftId,
            protocolId: input.protocolId,
            domain: analysis.domain,
            sourceAssetIds: analysis.sourceAssetIds,
            lifecycleStages: analysis.lifecycleStages,
            requirementRules: rules,
            externalActions: analysis.externalActions,
            conflicts: analysis.conflicts,
            gaps: analysis.gaps,
            generatedBy: analysis.generatedBy,
            createdAt: input.createdAt
        });

        draft.sourceEvidences = evidences;

        return draft;
    }

    engine.ProtocolGeneration.DraftGenerator = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
