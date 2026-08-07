/** PACEMAKER Platform Product v2 - Operation Change Runtime - Version 1.0.0 */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;
    var operationNamespace = global.PacemakerV2.Operation;

    function historyId(operationId, type, at) {
        return "HST-" + operationId + "-" + type + "-" + String(at).replace(/[^0-9]/g, "");
    }

    function confirm(input) {
        var current = input.currentOperation;
        var impact = input.changeImpact;
        var at = input.confirmedAt || new Date().toISOString();
        var changed;
        var version;
        var changeEvent;
        var versionEvent;

        if (!current || current.status !== operationNamespace.Schema.status.CONFIRMED || !current.currentVersion) {
            throw new Error("Operation change requires a confirmed current Version");
        }
        if (!impact || impact.operationId !== current.operationId) {
            throw new Error("Change impact and current Operation must match");
        }

        changed = global.PacemakerV2.Engine.OperationChange.ChangeConfirmer.confirm({
            currentOperation: current,
            proposedAnalysisResult: input.proposedAnalysisResult,
            changeImpact: impact,
            changeRequestId: input.changeRequestId,
            reason: input.reason,
            confirmedAt: at,
            confirmedBy: input.confirmedBy
        });

        changeEvent = operationNamespace.HistoryManager.createEvent({
            historyEventId: historyId(current.operationId, "CHANGE", at),
            operationId: current.operationId,
            eventType: "operation_change_confirmed",
            fromStatus: current.status,
            toStatus: changed.status,
            operationVersion: current.currentVersion,
            actorId: input.confirmedBy,
            reason: input.reason,
            changeRequestId: input.changeRequestId,
            changeImpactId: impact.changeImpactId,
            details: {
                beforeRequirementCount: impact.beforeRequirementCount,
                afterRequirementCount: impact.afterRequirementCount,
                removedRequirementAssignmentIds: changed.change.removedRequirementAssignmentIds
            },
            occurredAt: at
        });

        version = operationNamespace.VersionManager.createSnapshot(changed, {
            confirmedBy: input.confirmedBy,
            confirmedAt: at
        });

        versionEvent = operationNamespace.HistoryManager.createEvent({
            historyEventId: historyId(current.operationId, "VERSION", at),
            operationId: current.operationId,
            eventType: "operation_version_created",
            fromStatus: changed.status,
            toStatus: version.snapshot.status,
            operationVersion: version.version,
            actorId: input.confirmedBy,
            reason: input.reason,
            changeRequestId: input.changeRequestId,
            changeImpactId: impact.changeImpactId,
            details: { previousVersion: current.currentVersion, newVersion: version.version },
            occurredAt: at
        });

        return {
            operation: operationNamespace.Model.clone(version.snapshot),
            operationVersion: version,
            previousVersions: (input.previousVersions || []).concat([{
                operationVersionId: current.operationId + "-" + current.currentVersion,
                operationId: current.operationId,
                version: current.currentVersion,
                snapshot: operationNamespace.Model.clone(current)
            }]),
            historyEvents: (input.historyEvents || []).concat([changeEvent, versionEvent])
        };
    }

    runtime.OperationChange = Object.freeze({ confirm: confirm });
}(typeof globalThis !== "undefined" ? globalThis : this));
