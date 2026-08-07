/** PACEMAKER v2 Budget Control Projection Test */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    var view = global.PacemakerV2.Engine.Budget.ControlProjector.project({
        budgetState: global.PacemakerV2CommunityBudgetStateFixture
    });
    assert(view.operationVersion === "V002", "V002 예산이어야 합니다.");
    assert(view.summary.approvedTotal === 20000000, "승인예산 합계가 다릅니다.");
    assert(view.summary.usedTotal === 7000000, "승인된 지출결의서만 사용예산에 합산해야 합니다.");
    assert(view.summary.remainingTotal === 13000000, "잔여예산이 다릅니다.");
    assert(view.summary.usageRate === 35, "집행률이 다릅니다.");
    assert(view.summary.pendingExpenseCount === 1, "확인 대기 지출결의서는 별도로 집계해야 합니다.");
    assert(view.summary.missingEvidenceCount === 1, "증빙 누락 건수가 다릅니다.");
    assert(view.categories.length === 4, "예산 항목 수가 다릅니다.");
    assert(view.categories[3].usedAmount === 0, "확인 대기 지출결의서를 사용예산에 포함하면 안 됩니다.");
    assert(view.units.length === 3, "단위사업 수가 다릅니다.");
    assert(view.units[0].usedAmount === 2100000, "소식지 사용예산이 다릅니다.");
    assert(view.units[1].usedAmount === 4900000, "소통활동 사용예산이 다릅니다.");
    assert(view.units[2].usedAmount === 0, "성과공유회 사용예산이 다릅니다.");
    assert(view.units[1].occurrences.length === 3, "소통활동 승인 지출결의서 회차 연결이 다릅니다.");
    assert(view.units[1].occurrences[2].categoryTitle === "행사운영비", "지출항목 연결이 다릅니다.");
    global.PacemakerV2BudgetControlProjectionTestResult = Object.freeze({
        passed: true,
        operationVersion: view.operationVersion,
        approvedTotal: view.summary.approvedTotal,
        usedTotal: view.summary.usedTotal,
        remainingTotal: view.summary.remainingTotal,
        usageRate: view.summary.usageRate,
        pendingExpenseCount: view.summary.pendingExpenseCount,
        missingEvidenceCount: view.summary.missingEvidenceCount,
        categoryCount: view.categories.length,
        unitProjectCount: view.units.length,
        newsletterUsedAmount: view.units[0].usedAmount,
        communicationUsedAmount: view.units[1].usedAmount,
        communicationOccurrenceCount: view.units[1].occurrences.length
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
