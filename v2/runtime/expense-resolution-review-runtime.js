/** PACEMAKER v2 Expense Resolution Review Runtime */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;
    function review(input) {
        if (!input.expenseResolution || input.expenseResolution.status !== "pending") { throw new Error("확인 대기 지출결의서만 처리할 수 있습니다."); }
        if (["approved", "rejected"].indexOf(input.decision) < 0) { throw new Error("승인 또는 반려 결정을 선택해야 합니다."); }
        var reviewed = Object.freeze(Object.assign({}, input.expenseResolution, {
            status: input.decision,
            reviewedAt: input.reviewedAt,
            reviewedBy: input.reviewedBy,
            reviewNote: input.reviewNote || ""
        }));
        return Object.freeze({
            expenseResolution: reviewed,
            historyEvent: Object.freeze({ historyEventId: input.historyEventId, eventType: "expense_resolution_" + input.decision, targetId: reviewed.expenseResolutionId, occurredAt: input.reviewedAt, actorId: input.reviewedBy, note: reviewed.reviewNote }),
            workAction: input.decision === "approved" ? "complete" : "reopen"
        });
    }
    runtime.ExpenseResolutionReview = Object.freeze({ review: review });
}(typeof globalThis !== "undefined" ? globalThis : this));
