/** PACEMAKER v2 Expense Resolution Registration Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    var state = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
    var expense = global.PacemakerV2.Product.Budget.ExpenseResolutionModel.create({
        expenseResolutionId: "EXP-TEST-006", unitProjectId: "UNT-003", occurrenceId: "UNT-003-R001",
        categoryId: "BGT-103", amount: 300000, status: "approved", evidenceAttached: true,
        registeredAt: "2026-08-07T16:50:00.000Z", registeredBy: "USR-EXPERT-0001"
    });
    state.expenseResolutions.push(expense);
    var view = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: state });
    assert(view.summary.usedTotal === 7300000, "승인 지출결의서가 전체 사용예산에 반영되어야 합니다.");
    assert(view.units[2].usedAmount === 300000, "성과공유회 사용예산에 반영되어야 합니다.");
    assert(view.categories[2].usedAmount === 2000000, "행사운영비 사용예산에 반영되어야 합니다.");
    assert(view.units[2].occurrences[0].occurrenceNumber === 1, "회차가 연결되어야 합니다.");
    global.PacemakerV2ExpenseResolutionRegistrationTestResult = Object.freeze({ passed: true, usedTotal: view.summary.usedTotal, unitProjectUsedAmount: view.units[2].usedAmount, categoryUsedAmount: view.categories[2].usedAmount, occurrenceNumber: view.units[2].occurrences[0].occurrenceNumber });
}(typeof globalThis !== "undefined" ? globalThis : this));
