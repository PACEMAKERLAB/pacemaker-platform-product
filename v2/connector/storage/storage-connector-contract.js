/** PACEMAKER Platform Product v2 - Storage Connector Contract - Version 1.0.0 */
(function (global) {
    "use strict";
    var connector = global.PacemakerV2.Connector;
    connector.Storage = connector.Storage || {};

    function validate(candidate) {
        var errors = [];
        if (!candidate || !candidate.connectorId) { errors.push("connectorId"); }
        ["resolveAssets", "createArchive", "createDownloadLink"].forEach(function (method) {
            if (!candidate || typeof candidate[method] !== "function") { errors.push(method); }
        });
        return Object.freeze({ valid: errors.length === 0, missing: Object.freeze(errors) });
    }

    function assertValid(candidate) {
        var result = validate(candidate);
        if (!result.valid) { throw new Error("Storage Connector 계약 누락: " + result.missing.join(", ")); }
        return candidate;
    }

    connector.Storage.Contract = Object.freeze({ validate: validate, assertValid: assertValid });
}(typeof globalThis !== "undefined" ? globalThis : this));
