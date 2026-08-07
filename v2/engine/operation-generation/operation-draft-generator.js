/**
 * PACEMAKER Platform Product v2
 * Operation Draft Generator
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.OperationGeneration = engine.OperationGeneration || {};

    function generate(input) {
        var source = input || {};
        var analysis = source.analysisResult;
        var recommendation = source.protocolRecommendation;
        var analysisValidation;
        var recommendationValidation;

        analysisValidation = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.validate(analysis);
        recommendationValidation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.validate(recommendation);

        if (!analysisValidation.valid) {
            throw new Error("Invalid AnalysisResult: " + analysisValidation.errors.join(", "));
        }

        if (!recommendationValidation.valid) {
            throw new Error("Invalid ProtocolRecommendation: " + recommendationValidation.errors.join(", "));
        }

        if (analysis.projectId !== recommendation.projectId) {
            throw new Error("AnalysisResult and ProtocolRecommendation projectId must match");
        }

        return global.PacemakerV2.Operation.Model.create({
            operationId: source.operationId,
            projectId: analysis.projectId,
            title: analysis.project.title,
            sourceAssetIds: analysis.sourceAssetIds,
            protocolRecommendation: recommendation,
            lifecycle: analysis.lifecycle,
            unitProjects: analysis.unitProjects,
            budget: {
                approved: analysis.budget.approved || [],
                used: []
            },
            createdBy: source.createdBy,
            now: source.createdAt
        });
    }

    engine.OperationGeneration.DraftGenerator = Object.freeze({
        generate: generate
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
