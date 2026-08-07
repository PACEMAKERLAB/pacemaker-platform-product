/** PACEMAKER Platform Product v2 - Report Connector Contract - Version 1.0.0 */
(function (global) {
    "use strict";
    var connector = global.PacemakerV2.Connector;
    connector.Report = connector.Report || {};

    function validate(candidate) {
        var missing = [];
        if (!candidate || !candidate.connectorId) { missing.push("connectorId"); }
        ["renderDocument", "createDownloadLink"].forEach(function (method) {
            if (!candidate || typeof candidate[method] !== "function") { missing.push(method); }
        });
        return Object.freeze({ valid: missing.length === 0, missing: Object.freeze(missing) });
    }
    function assertValid(candidate) {
        var result = validate(candidate);
        if (!result.valid) { throw new Error("Report Connector 계약 누락: " + result.missing.join(", ")); }
        return candidate;
    }
    connector.Report.Contract = Object.freeze({ validate: validate, assertValid: assertValid });
}(typeof globalThis !== "undefined" ? globalThis : this));
