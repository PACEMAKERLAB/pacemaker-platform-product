/** PACEMAKER v2 Expense Resolution Review Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    var state = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
    var pendingIndex = state.expenseResolutions.findIndex(function (item) { return item.status === "expert_review_pending"; });
    var inspected = global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(state.expenseResolutions[pendingIndex], state.expenseResolutions[pendingIndex].evidenceAssets.map(function (item) { return item.sourceAssetId; }));
    var result = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({ expenseResolution: state.expenseResolutions[pendingIndex], executionState: global.PacemakerV2CommunityExecutionStateFixture, evidenceReview: inspected, decision: "approved", reviewedAt: "2026-08-07T17:00:00.000Z", reviewedBy: "USR-EXPERT-0001", reviewNote: "확인 완료", historyEventId: "HST-EXPENSE-TEST-001" });
    state.expenseResolutions[pendingIndex] = result.expenseResolution;
    var readyView = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: state });
    assert(result.workAction === "prepare_botame", "자료 검토 후 보탬e 등록 준비 단계여야 합니다.");
    assert(readyView.summary.usedTotal === 7000000, "전문가 검토만으로 사용예산에 반영하면 안 됩니다.");
    var completed = global.PacemakerV2.Runtime.BotameCompletion.complete({ expenseResolution: state.expenseResolutions[pendingIndex], executionState: result.executionState, completedAt: "2026-08-07T17:10:00.000Z", completedBy: "USR-CUSTOMER-0001", historyEventId: "HST-BOTAME-TEST-001" });
    state.expenseResolutions[pendingIndex] = completed.expenseResolution;
    var view = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: state });
    assert(view.summary.usedTotal === 7600000, "보탬e 처리 완료 후 사용예산에 반영되어야 합니다.");
    assert(view.categories[3].usedAmount === 600000, "일반운영비에 반영되어야 합니다.");
    assert(result.documentKey === "UNT-002-R004:expense-resolution", "단위사업 회차 문서에 연결되어야 합니다.");
    assert(result.executionState.documentStatus[result.documentKey] === "attached", "자료·문서에 첨부 상태가 반영되어야 합니다.");
    assert(result.executionState.documentReviewStatus[result.documentKey] === "approved", "자료·문서에 승인 상태가 반영되어야 합니다.");
    global.PacemakerV2ExpenseResolutionReviewTestResult = Object.freeze({ passed: true, expertReviewStatus: result.expenseResolution.status, usedAfterExpertReview: readyView.summary.usedTotal, finalStatus: completed.expenseResolution.status, usedAfterBotameComplete: view.summary.usedTotal, categoryUsedAmount: view.categories[3].usedAmount, documentKey: result.documentKey, documentStatus: result.executionState.documentStatus[result.documentKey], documentReviewStatus: result.executionState.documentReviewStatus[result.documentKey], historyEventType: completed.historyEvent.eventType, workAction: completed.workAction });
}(typeof globalThis !== "undefined" ? globalThis : this));
