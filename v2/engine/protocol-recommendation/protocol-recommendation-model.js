/**
 * PACEMAKER Platform Product v2
 * Protocol Recommendation Model
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.ProtocolRecommendation = engine.ProtocolRecommendation || {};

    function create(input) {
        var source = input || {};

        return {
            recommendationId: source.recommendationId || "",
            analysisResultId: source.analysisResultId || "",
            projectId: source.projectId || "",
            protocolId: source.protocolId || null,
            protocolVersion: source.protocolVersion || null,
            confidence: Number.isFinite(source.confidence) ? source.confidence : 0,
            reasons: Array.isArray(source.reasons) ? source.reasons.slice() : [],
            gaps: Array.isArray(source.gaps) ? source.gaps.slice() : [],
            status: "recommended",
            createdAt: source.createdAt || new Date().toISOString()
        };
    }

    function validate(recommendation) {
        var errors = [];

        ["recommendationId", "analysisResultId", "projectId", "protocolId"].forEach(function (field) {
            if (!recommendation || !recommendation[field]) {
                errors.push(field + " must not be empty");
            }
        });

        if (!recommendation || recommendation.confidence < 0 || recommendation.confidence > 1) {
            errors.push("confidence must be between 0 and 1");
        }

        return { valid: errors.length === 0, errors: errors };
    }

    engine.ProtocolRecommendation.Model = Object.freeze({
        create: create,
        validate: validate
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
