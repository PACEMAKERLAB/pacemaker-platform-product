/**
 * PACEMAKER Platform Product v2
 * Operation Review Runtime
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var runtime = global.PacemakerV2.Runtime;
    var operationNamespace = global.PacemakerV2.Operation;

    function createHistoryId(operationId, eventType, at) {
        return "HST-" + operationId + "-" + eventType + "-" + String(at).replace(/[^0-9]/g, "");
    }

    function open(operation, input) {
        var at = input.at || new Date().toISOString();
        var result = operationNamespace.StateMachine.transition(operation, {
            toStatus: operationNamespace.Schema.status.IN_REVIEW,
            actorId: input.expertId,
            historyEventId: createHistoryId(operation.operationId, "REVIEW", at),
            at: at
        });

        return {
            operation: result.operation,
            historyEvents: [result.historyEvent]
        };
    }

    function edit(session, input) {
        var at = input.at || new Date().toISOString();
        var before = session.operation;
        var updated = operationNamespace.ReviewEditor.apply(before, {
            section: input.section,
            action: input.action,
            itemId: input.itemId,
            item: input.item,
            changes: input.changes,
            editedAt: at,
            editedBy: input.expertId
        });
        var event = operationNamespace.HistoryManager.createEvent({
            historyEventId: createHistoryId(before.operationId, "EDIT", at),
            operationId: before.operationId,
            eventType: "operation_review_edited",
            fromStatus: before.status,
            toStatus: updated.status,
            operationVersion: before.currentVersion,
            actorId: input.expertId,
            reason: input.section + ":" + input.action,
            occurredAt: at
        });

        return {
            operation: updated,
            historyEvents: session.historyEvents.concat([event])
        };
    }

    function confirmSection(session, input) {
        var section = input.section;
        var at = input.at || new Date().toISOString();
        var updated;
        var event;

        if (!operationNamespace.ReviewPolicy.editableCollection[section]) {
            throw new Error("Unknown review section: " + section);
        }

        if (session.operation.status !== operationNamespace.Schema.status.IN_REVIEW) {
            throw new Error("Section confirmation is allowed only during review");
        }

        updated = operationNamespace.Model.clone(session.operation);
        updated.review.sectionConfirmations[section] = true;
        updated.updatedAt = at;
        updated.updatedBy = input.expertId;

        event = operationNamespace.HistoryManager.createEvent({
            historyEventId: createHistoryId(updated.operationId, "SECTION", at),
            operationId: updated.operationId,
            eventType: "operation_review_section_confirmed",
            fromStatus: updated.status,
            toStatus: updated.status,
            operationVersion: updated.currentVersion,
            actorId: input.expertId,
            reason: section,
            occurredAt: at
        });

        return {
            operation: updated,
            historyEvents: session.historyEvents.concat([event])
        };
    }

    function confirm(session, input) {
        var at = input.at || new Date().toISOString();
        var transitionResult;
        var version;
        var versionEvent;

        if (!operationNamespace.ReviewPolicy.allSectionsConfirmed(session.operation)) {
            throw new Error("All review sections must be confirmed before Operation confirmation");
        }

        transitionResult = operationNamespace.StateMachine.transition(session.operation, {
            toStatus: operationNamespace.Schema.status.CONFIRMED,
            actorId: input.expertId,
            historyEventId: createHistoryId(session.operation.operationId, "CONFIRM", at),
            at: at
        });

        version = operationNamespace.VersionManager.createSnapshot(transitionResult.operation, {
            confirmedBy: input.expertId,
            confirmedAt: at
        });

        versionEvent = operationNamespace.HistoryManager.createEvent({
            historyEventId: createHistoryId(session.operation.operationId, "VERSION", at),
            operationId: session.operation.operationId,
            eventType: "operation_version_created",
            fromStatus: transitionResult.operation.status,
            toStatus: transitionResult.operation.status,
            operationVersion: version.version,
            actorId: input.expertId,
            occurredAt: at
        });

        return {
            operation: operationNamespace.Model.clone(version.snapshot),
            operationVersion: version,
            historyEvents: session.historyEvents.concat([
                transitionResult.historyEvent,
                versionEvent
            ])
        };
    }

    runtime.OperationReview = Object.freeze({
        open: open,
        edit: edit,
        confirmSection: confirmSection,
        confirm: confirm
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
