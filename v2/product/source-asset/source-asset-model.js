/**
 * PACEMAKER Platform Product v2
 * Source Asset Model
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var product = global.PacemakerV2.Product = global.PacemakerV2.Product || {};
    product.SourceAsset = product.SourceAsset || {};

    var ASSET_TYPE = Object.freeze({
        APPROVED_PLAN: "approved_plan",
        NOTICE: "notice",
        BUDGET: "budget",
        TEMPLATE: "template",
        CHANGE_PLAN: "change_plan",
        OTHER: "other"
    });

    function create(input) {
        var source = input || {};
        var now = source.now || new Date().toISOString();

        return {
            sourceAssetId: source.sourceAssetId || "",
            projectId: source.projectId || "",
            assetType: source.assetType || ASSET_TYPE.OTHER,
            fileName: source.fileName || "",
            mimeType: source.mimeType || "application/octet-stream",
            storageReference: source.storageReference || null,
            authority: source.authority || "reference",
            uploadedAt: now,
            uploadedBy: source.uploadedBy || null
        };
    }

    function validate(asset) {
        var errors = [];

        if (!asset || typeof asset !== "object") {
            return { valid: false, errors: ["source asset must be an object"] };
        }

        ["sourceAssetId", "projectId", "assetType", "fileName"].forEach(function (field) {
            if (!asset[field]) {
                errors.push(field + " must not be empty");
            }
        });

        if (Object.values(ASSET_TYPE).indexOf(asset.assetType) === -1) {
            errors.push("assetType is invalid");
        }

        return { valid: errors.length === 0, errors: errors };
    }

    product.SourceAsset.Model = Object.freeze({
        assetType: ASSET_TYPE,
        create: create,
        validate: validate
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
