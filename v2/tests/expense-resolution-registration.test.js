/** PACEMAKER v2 Expense Resolution Registration Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    var state = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
    var expense = global.PacemakerV2.Product.Budget.ExpenseResolutionModel.create({
        expenseResolutionId: "EXP-TEST-006", unitProjectId: "UNT-003", occurrenceId: "UNT-003-R001",
        categoryId: "BGT-103", amount: 300000, status: "expert_review_pending", evidenceAttached: true,
        registeredAt: "2026-08-07T16:50:00.000Z", registeredBy: "USR-EXPERT-0001"
    });
    state.expenseResolutions.push(expense);
    var view = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: state });
    assert(view.summary.usedTotal === 7000000, "등록만으로 사용예산에 반영하면 안 됩니다.");
    assert(view.units[2].usedAmount === 0, "보탬e 처리 전에는 단위사업 사용예산에서 제외해야 합니다.");
    assert(view.summary.pendingExpenseCount === 2, "전문가 검토·보탬e 처리 대기로 집계해야 합니다.");
    global.PacemakerV2ExpenseResolutionRegistrationTestResult = Object.freeze({ passed: true, usedTotal: view.summary.usedTotal, unitProjectUsedAmount: view.units[2].usedAmount, categoryUsedAmount: view.categories[2].usedAmount, pendingExpenseCount: view.summary.pendingExpenseCount });
}(typeof globalThis !== "undefined" ? globalThis : this));
