/**
 * PACEMAKER Platform Product v2
 * Document Analysis Result Model
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.DocumentAnalysis = engine.DocumentAnalysis || {};

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function create(input) {
        var source = input || {};

        return {
            analysisResultId: source.analysisResultId || "",
            projectId: source.projectId || "",
            sourceAssetIds: clone(source.sourceAssetIds || []),
            analyzer: {
                provider: source.provider || "manual-fixture",
                model: source.model || null,
                analyzedAt: source.analyzedAt || new Date().toISOString()
            },
            project: clone(source.project || {}),
            lifecycle: clone(source.lifecycle || []),
            unitProjects: clone(source.unitProjects || []),
            budget: clone(source.budget || { approved: [] }),
            requiredDocuments: clone(source.requiredDocuments || []),
            extractionEvidence: clone(source.extractionEvidence || []),
            warnings: clone(source.warnings || [])
        };
    }

    function validate(result) {
        var errors = [];

        if (!result || typeof result !== "object") {
            return { valid: false, errors: ["analysis result must be an object"] };
        }

        ["analysisResultId", "projectId"].forEach(function (field) {
            if (!result[field]) {
                errors.push(field + " must not be empty");
            }
        });

        if (!Array.isArray(result.sourceAssetIds) || result.sourceAssetIds.length === 0) {
            errors.push("sourceAssetIds must contain at least one asset");
        }

        if (!result.project || !result.project.title) {
            errors.push("project.title must not be empty");
        }

        ["lifecycle", "unitProjects", "requiredDocuments", "extractionEvidence"].forEach(function (field) {
            if (!Array.isArray(result[field])) {
                errors.push(field + " must be an array");
            }
        });

        result.extractionEvidence.forEach(function (evidence, index) {
            if (!evidence.sourceAssetId || !evidence.fieldPath) {
                errors.push("extractionEvidence[" + index + "] requires sourceAssetId and fieldPath");
            }
        });

        return { valid: errors.length === 0, errors: errors };
    }

    engine.DocumentAnalysis.ResultModel = Object.freeze({
        create: create,
        validate: validate
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
