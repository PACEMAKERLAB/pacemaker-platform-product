/** PACEMAKER v2 Expense Resolution Model */
(function (global) {
    "use strict";
    var product = global.PacemakerV2.Product;
    product.Budget = product.Budget || {};
    function required(value, name) { if (value === undefined || value === null || value === "") { throw new Error(name + " 항목이 필요합니다."); } }
    function create(input) {
        required(input.unitProjectId, "단위사업"); required(input.occurrenceId, "회차"); required(input.categoryId, "예산 지출항목");
        var amount = Number(input.amount);
        if (!Number.isFinite(amount) || amount <= 0) { throw new Error("지출금액은 0보다 커야 합니다."); }
        if (["expert_review_pending", "botame_ready", "botame_completed"].indexOf(input.status) < 0) { throw new Error("처리상태가 올바르지 않습니다."); }
        return Object.freeze({
            expenseResolutionId: input.expenseResolutionId,
            categoryId: input.categoryId,
            unitProjectId: input.unitProjectId,
            occurrenceId: input.occurrenceId,
            amount: amount,
            status: input.status,
            evidenceAttached: input.evidenceAttached === true,
            registeredAt: input.registeredAt,
            registeredBy: input.registeredBy
        });
    }
    product.Budget.ExpenseResolutionModel = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
