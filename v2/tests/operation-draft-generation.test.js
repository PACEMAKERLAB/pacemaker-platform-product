/**
 * PACEMAKER Platform Product v2
 * Operation Draft Generation Test
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    function run() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var sourceAsset = global.PacemakerV2.Product.SourceAsset.Model.create(fixture.sourceAsset);
        var analysisResult = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(
            fixture.analysisResult
        );
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(
            fixture.protocolRecommendation
        );
        var operationDraft;

        assert(
            global.PacemakerV2.Product.SourceAsset.Model.validate(sourceAsset).valid,
            "source asset must be valid"
        );

        operationDraft = global.PacemakerV2.Engine.OperationGeneration.DraftGenerator.generate({
            operationId: "OPR-2026-0001",
            analysisResult: analysisResult,
            protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001",
            createdAt: "2026-08-07T10:20:00.000Z"
        });

        assert(operationDraft.status === "draft", "generated operation must be draft");
        assert(operationDraft.currentVersion === null, "draft must not have a confirmed version");
        assert(operationDraft.sourceAssetIds[0] === sourceAsset.sourceAssetId, "source trace must remain");
        assert(operationDraft.unitProjects.length === 3, "unit projects must be mapped");
        assert(operationDraft.budget.approved[0].amount === 20000000, "approved budget must be mapped");
        assert(
            operationDraft.protocolRecommendation.protocolId === "PTC-COMMUNITY-001",
            "recommended protocol must be mapped"
        );

        return {
            passed: true,
            sourceAssetId: sourceAsset.sourceAssetId,
            analysisResultId: analysisResult.analysisResultId,
            protocolId: recommendation.protocolId,
            operationId: operationDraft.operationId,
            operationStatus: operationDraft.status,
            unitProjectCount: operationDraft.unitProjects.length,
            approvedBudget: operationDraft.budget.approved[0].amount
        };
    }

    global.PacemakerV2OperationDraftGenerationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
