/** PACEMAKER v2 Overview Budget Evidence Sync Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    function run() {
        var versionState = global.PacemakerV2CommunityOperationV2Fixture.build("USR-EXPERT-0001");
        var budgetState = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
        var execution = JSON.parse(JSON.stringify(global.PacemakerV2CommunityExecutionStateFixture));
        var derived = global.PacemakerV2.Runtime.DerivedWork.execute(versionState.operation, { asOfDate: execution.asOfDate });
        var initialBudget = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
        execution.usedBudget = [{ categoryId: "BGT-001", amount: initialBudget.summary.usedTotal, source: "approved_expense_resolutions" }];
        var before = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(versionState.operation, derived, execution, versionState);
        var pendingIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.status === "pending"; });
        var reviewed = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({ expenseResolution: budgetState.expenseResolutions[pendingIndex], executionState: execution, decision: "approved", reviewedAt: "2026-08-07T17:20:00.000Z", reviewedBy: "USR-EXPERT-0001", historyEventId: "HST-SYNC-001" });
        budgetState.expenseResolutions[pendingIndex] = reviewed.expenseResolution;
        var approvedBudget = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
        execution = reviewed.executionState;
        execution.usedBudget = [{ categoryId: "BGT-001", amount: approvedBudget.summary.usedTotal, source: "approved_expense_resolutions" }];
        var after = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(versionState.operation, derived, execution, versionState);
        assert(before.totals.usedBudget === 7000000, "개요 초기 사용예산은 예산 엔진과 일치해야 합니다.");
        assert(after.totals.usedBudget === 7600000, "승인 후 개요 사용예산이 갱신되어야 합니다.");
        assert(after.totals.approvedBudget - after.totals.usedBudget === 12400000, "개요 잔여예산이 갱신되어야 합니다.");
        assert(after.priorityItems.length > 0, "개요에 지금 확인할 일이 생성되어야 합니다.");
        return { passed: true, beforeUsedBudget: before.totals.usedBudget, afterUsedBudget: after.totals.usedBudget, remainingBudget: after.totals.approvedBudget - after.totals.usedBudget, evidenceMissing: after.totals.evidenceMissing, priorityItemCount: after.priorityItems.length, documentReviewStatus: execution.documentReviewStatus[reviewed.documentKey] };
    }
    global.PacemakerV2OverviewBudgetEvidenceSyncTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
