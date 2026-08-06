/**
 * PACEMAKER Platform Product v2
 * Operation Version Manager
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    function nextVersion(currentVersion) {
        var currentNumber = 0;
        var match;

        if (typeof currentVersion === "string") {
            match = currentVersion.match(/^V(\d{3})$/);
            currentNumber = match ? Number(match[1]) : 0;
        }

        return "V" + String(currentNumber + 1).padStart(3, "0");
    }

    function createSnapshot(operation, confirmation) {
        var version = nextVersion(operation.currentVersion);
        var snapshot = namespace.Model.clone(operation);

        snapshot.status = namespace.Schema.status.CONFIRMED;
        snapshot.currentVersion = version;
        snapshot.confirmation = {
            confirmedAt: confirmation.confirmedAt,
            confirmedBy: confirmation.confirmedBy
        };
        snapshot.updatedAt = confirmation.confirmedAt;
        snapshot.updatedBy = confirmation.confirmedBy;

        return Object.freeze({
            operationVersionId: operation.operationId + "-" + version,
            operationId: operation.operationId,
            version: version,
            confirmedAt: confirmation.confirmedAt,
            confirmedBy: confirmation.confirmedBy,
            snapshot: snapshot
        });
    }

    namespace.VersionManager = Object.freeze({
        nextVersion: nextVersion,
        createSnapshot: createSnapshot
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
