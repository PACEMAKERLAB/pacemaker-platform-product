/** PACEMAKER v2 Expense Resolution Review Runtime */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;
    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function inspect(expenseResolution, reviewedAssetIds) {
        var reviewed = reviewedAssetIds || [];
        var assets = expenseResolution.evidenceAssets || [];
        var items = (expenseResolution.evidenceRequirements || []).map(function (requirement) {
            var asset = assets.find(function (candidate) { return candidate.documentType === requirement.documentType; });
            return Object.assign({}, requirement, { asset: asset || null, attached: !!asset, reviewed: !!asset && reviewed.indexOf(asset.sourceAssetId) >= 0 });
        });
        return { items: items, requiredCount: items.filter(function (item) { return item.required; }).length, attachedCount: items.filter(function (item) { return item.required && item.attached; }).length, reviewedCount: items.filter(function (item) { return item.required && item.reviewed; }).length, canApprove: items.length > 0 && items.every(function (item) { return !item.required || (item.attached && item.reviewed); }) };
    }
    function review(input) {
        if (!input.expenseResolution || input.expenseResolution.status !== "expert_review_pending") { throw new Error("전문가 검토 대기 지출결의서만 처리할 수 있습니다."); }
        if (["approved", "rejected"].indexOf(input.decision) < 0) { throw new Error("승인 또는 반려 결정을 선택해야 합니다."); }
        if (input.decision === "approved" && (!input.evidenceReview || !input.evidenceReview.canApprove)) { throw new Error("모든 필수 증빙자료를 열람·확인한 후 승인할 수 있습니다."); }
        var reviewed = Object.freeze(Object.assign({}, input.expenseResolution, {
            status: input.decision === "approved" ? "botame_ready" : "rejected",
            reviewedAt: input.reviewedAt,
            reviewedBy: input.reviewedBy,
            reviewNote: input.reviewNote || ""
        }));
        var executionState = clone(input.executionState || {});
        var documentKey = reviewed.occurrenceId + ":expense-resolution";
        executionState.documentStatus = executionState.documentStatus || {};
        executionState.documentReviewStatus = executionState.documentReviewStatus || {};
        executionState.documentStatus[documentKey] = "attached";
        executionState.documentReviewStatus[documentKey] = input.decision === "approved" ? "approved" : "rejected";
        executionState.documentWorkflowStatus = executionState.documentWorkflowStatus || {};
        executionState.documentWorkflowStatus[documentKey] = input.decision === "approved" ? "botame_ready" : "supplement_required";
        return Object.freeze({
            expenseResolution: reviewed,
            executionState: executionState,
            documentKey: documentKey,
            historyEvent: Object.freeze({ historyEventId: input.historyEventId, eventType: input.decision === "approved" ? "expense_evidence_review_completed" : "expense_evidence_supplement_requested", targetId: reviewed.expenseResolutionId, occurredAt: input.reviewedAt, actorId: input.reviewedBy, note: reviewed.reviewNote }),
            workAction: input.decision === "approved" ? "prepare_botame" : "reopen"
        });
    }
    runtime.ExpenseResolutionReview = Object.freeze({ inspect: inspect, review: review });
}(typeof globalThis !== "undefined" ? globalThis : this));
