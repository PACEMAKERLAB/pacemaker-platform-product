/** PACEMAKER v2 Botam-e Completion Runtime */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;
    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function complete(input) {
        if (!input.expenseResolution || input.expenseResolution.status !== "botame_ready") { throw new Error("보탬e 등록 준비가 완료된 지출결의서만 처리할 수 있습니다."); }
        var expenseResolution = Object.freeze(Object.assign({}, input.expenseResolution, { status: "botame_completed", botameCompletedAt: input.completedAt, botameCompletedBy: input.completedBy }));
        var executionState = clone(input.executionState || {});
        var documentKey = expenseResolution.occurrenceId + ":expense-resolution";
        executionState.documentWorkflowStatus = executionState.documentWorkflowStatus || {};
        executionState.documentWorkflowStatus[documentKey] = "evidence_completed";
        return Object.freeze({ expenseResolution: expenseResolution, executionState: executionState, documentKey: documentKey, historyEvent: Object.freeze({ historyEventId: input.historyEventId, eventType: "botame_processing_completed", targetId: expenseResolution.expenseResolutionId, occurredAt: input.completedAt, actorId: input.completedBy }), workAction: "complete" });
    }
    runtime.BotameCompletion = Object.freeze({ complete: complete });
}(typeof globalThis !== "undefined" ? globalThis : this));
