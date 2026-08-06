/**
 * PACEMAKER Platform Product v2
 * Operation State Machine
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;
    var STATUS = namespace.Schema.status;

    var TRANSITIONS = Object.freeze({
        draft: [STATUS.IN_REVIEW, STATUS.ARCHIVED],
        in_review: [STATUS.DRAFT, STATUS.CONFIRMED, STATUS.ARCHIVED],
        confirmed: [STATUS.CHANGED, STATUS.ARCHIVED],
        changed: [STATUS.IN_REVIEW, STATUS.ARCHIVED],
        archived: []
    });

    function canTransition(fromStatus, toStatus) {
        var allowed = TRANSITIONS[fromStatus] || [];
        return allowed.indexOf(toStatus) !== -1;
    }

    function transition(operation, transitionInput) {
        var input = transitionInput || {};
        var toStatus = input.toStatus;
        var at = input.at || new Date().toISOString();
        var actorId = input.actorId || null;
        var updated;

        namespace.Validator.assertValid(operation);

        if (!canTransition(operation.status, toStatus)) {
            throw new Error(
                "Invalid Operation transition: " + operation.status + " -> " + toStatus
            );
        }

        if (toStatus === STATUS.CONFIRMED && !actorId) {
            throw new Error("confirmed transition requires actorId");
        }

        if (toStatus === STATUS.CHANGED && (!actorId || !input.changeRequestId || !input.reason)) {
            throw new Error("changed transition requires actorId, changeRequestId and reason");
        }

        updated = namespace.Model.clone(operation);
        updated.status = toStatus;
        updated.updatedAt = at;
        updated.updatedBy = actorId;

        if (toStatus === STATUS.IN_REVIEW) {
            updated.review.requestedAt = at;
        }

        if (toStatus === STATUS.DRAFT) {
            updated.review.notes.push({
                note: input.reason || "review returned",
                createdAt: at,
                createdBy: actorId
            });
        }

        if (toStatus === STATUS.CONFIRMED) {
            updated.review.reviewedAt = at;
            updated.review.reviewerId = actorId;
            updated.confirmation.confirmedAt = at;
            updated.confirmation.confirmedBy = actorId;
        }

        if (toStatus === STATUS.CHANGED) {
            updated.change.changeRequestId = input.changeRequestId;
            updated.change.changedAt = at;
            updated.change.changedBy = actorId;
            updated.change.reason = input.reason;
        }

        return {
            operation: updated,
            historyEvent: namespace.HistoryManager.createEvent({
                historyEventId: input.historyEventId,
                operationId: operation.operationId,
                eventType: "operation_status_changed",
                fromStatus: operation.status,
                toStatus: toStatus,
                operationVersion: operation.currentVersion,
                actorId: actorId,
                reason: input.reason,
                occurredAt: at
            })
        };
    }

    namespace.StateMachine = Object.freeze({
        transitions: TRANSITIONS,
        canTransition: canTransition,
        transition: transition
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
