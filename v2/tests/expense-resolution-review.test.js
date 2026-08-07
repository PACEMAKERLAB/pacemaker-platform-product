/** PACEMAKER v2 Expense Resolution Review Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    var state = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
    var pendingIndex = state.expenseResolutions.findIndex(function (item) { return item.status === "pending"; });
    var result = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({ expenseResolution: state.expenseResolutions[pendingIndex], executionState: global.PacemakerV2CommunityExecutionStateFixture, decision: "approved", reviewedAt: "2026-08-07T17:00:00.000Z", reviewedBy: "USR-EXPERT-0001", reviewNote: "확인 완료", historyEventId: "HST-EXPENSE-TEST-001" });
    state.expenseResolutions[pendingIndex] = result.expenseResolution;
    var view = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: state });
    assert(result.workAction === "complete", "승인 시 관련 할 일을 완료해야 합니다.");
    assert(view.summary.usedTotal === 7600000, "승인 금액이 사용예산에 반영되어야 합니다.");
    assert(view.summary.pendingExpenseCount === 0, "확인 대기 건수가 감소해야 합니다.");
    assert(view.categories[3].usedAmount === 600000, "일반운영비에 반영되어야 합니다.");
    assert(result.documentKey === "UNT-002-R004:expense-resolution", "단위사업 회차 문서에 연결되어야 합니다.");
    assert(result.executionState.documentStatus[result.documentKey] === "attached", "자료·문서에 첨부 상태가 반영되어야 합니다.");
    assert(result.executionState.documentReviewStatus[result.documentKey] === "approved", "자료·문서에 승인 상태가 반영되어야 합니다.");
    global.PacemakerV2ExpenseResolutionReviewTestResult = Object.freeze({ passed: true, decision: result.expenseResolution.status, usedTotal: view.summary.usedTotal, pendingExpenseCount: view.summary.pendingExpenseCount, categoryUsedAmount: view.categories[3].usedAmount, documentKey: result.documentKey, documentStatus: result.executionState.documentStatus[result.documentKey], documentReviewStatus: result.executionState.documentReviewStatus[result.documentKey], historyEventType: result.historyEvent.eventType, workAction: result.workAction });
}(typeof globalThis !== "undefined" ? globalThis : this));
