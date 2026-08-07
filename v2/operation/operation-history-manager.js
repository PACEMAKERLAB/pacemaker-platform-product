/**
 * PACEMAKER Platform Product v2
 * Operation History Manager
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    function createEvent(input) {
        return {
            historyEventId: input.historyEventId,
            operationId: input.operationId,
            eventType: input.eventType,
            fromStatus: input.fromStatus || null,
            toStatus: input.toStatus || null,
            operationVersion: input.operationVersion || null,
            actorId: input.actorId || null,
            reason: input.reason || null,
            changeRequestId: input.changeRequestId || null,
            changeImpactId: input.changeImpactId || null,
            details: input.details || null,
            occurredAt: input.occurredAt || new Date().toISOString()
        };
    }

    namespace.HistoryManager = Object.freeze({
        createEvent: createEvent
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
