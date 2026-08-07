/** PACEMAKER Platform Product v2 - Botam-e Submission Package Generator - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.BotameSubmission = engine.BotameSubmission || {};

    function safeName(value) {
        return String(value || "자료").replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_");
    }

    function generate(input) {
        var expense = input.expenseResolution;
        var requirements;
        var assets;
        var files;
        var missing;
        var unitTitle = input.unitProjectTitle || expense.unitProjectId;
        var round = Number(String(expense.occurrenceId || "").split("R").pop()) || 0;

        if (!expense || expense.status !== "botame_ready") {
            throw new Error("전문가 검토가 완료된 지출결의서만 보탬e 제출자료를 생성할 수 있습니다.");
        }
        requirements = expense.evidenceRequirements || [];
        assets = expense.evidenceAssets || [];
        missing = requirements.filter(function (requirement) {
            return requirement.required !== false && !assets.some(function (asset) {
                return asset.documentType === requirement.documentType;
            });
        });
        if (missing.length) {
            throw new Error("필수 제출자료 " + missing.length + "건이 누락되었습니다.");
        }

        files = requirements.map(function (requirement, index) {
            var asset = assets.find(function (candidate) {
                return candidate.documentType === requirement.documentType;
            });
            return Object.freeze({
                order: index + 1,
                documentType: requirement.documentType,
                title: requirement.title,
                required: requirement.required !== false,
                sourceAssetId: asset ? asset.sourceAssetId : null,
                fileName: asset ? asset.fileName : null,
                storageReference: asset ? asset.storageReference : null,
                included: !!asset
            });
        });

        return global.PacemakerV2.Product.Botame.SubmissionPackageModel.create({
            submissionPackageId: input.submissionPackageId,
            expenseResolutionId: expense.expenseResolutionId,
            operationVersion: input.operationVersion,
            unitProjectId: expense.unitProjectId,
            occurrenceId: expense.occurrenceId,
            categoryId: expense.categoryId,
            amount: expense.amount,
            status: "download_ready",
            downloadFileName: safeName(input.projectTitle) + "_" + safeName(unitTitle) + "_" + round + "회차_보탬e_제출자료.zip",
            files: files,
            manifest: {
                projectTitle: input.projectTitle,
                unitProjectTitle: unitTitle,
                occurrenceNumber: round,
                categoryTitle: input.categoryTitle,
                amount: expense.amount,
                requiredFileCount: requirements.filter(function (item) { return item.required !== false; }).length,
                includedFileCount: files.filter(function (item) { return item.included; }).length,
                missingFileCount: missing.length
            },
            generatedAt: input.generatedAt,
            generatedBy: input.generatedBy
        });
    }

    engine.BotameSubmission.PackageGenerator = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
