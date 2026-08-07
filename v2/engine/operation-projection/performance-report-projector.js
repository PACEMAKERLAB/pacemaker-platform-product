/** PACEMAKER Platform Product v2 - Performance Report Projector - Version 1.0.0 */
(function (global) {
    "use strict";
    var projection = global.PacemakerV2.Engine.OperationProjection;

    function project(input) {
        var operation = input.operation;
        var overview = input.overviewView;
        var documents = input.documentView;
        var budget = input.budgetView;
        var plannedExecution = overview.unitProjects.reduce(function (sum, item) { return sum + item.plannedCount; }, 0);
        var completedExecution = overview.unitProjects.reduce(function (sum, item) { return sum + item.completedCount; }, 0);
        var completedDocumentCount = documents.summary.attachedCount + documents.summary.missingCount;
        var evidenceCompletionRate = completedDocumentCount ? Math.round(documents.summary.attachedCount / completedDocumentCount * 100) : 100;
        var blockers = [];

        if (plannedExecution > completedExecution) {
            blockers.push({ blockerType: "execution_remaining", count: plannedExecution - completedExecution, title: "남은 단위사업 실행 " + (plannedExecution - completedExecution) + "회" });
        }
        if (documents.summary.missingCount > 0) {
            blockers.push({ blockerType: "evidence_missing", count: documents.summary.missingCount, title: "완료 회차 증빙 누락 " + documents.summary.missingCount + "건" });
        }
        if (overview.totals.planningRequired > 0) {
            blockers.push({ blockerType: "planning_required", count: overview.totals.planningRequired, title: "실행계획 등록 필요 " + overview.totals.planningRequired + "회" });
        }
        if (budget.summary.missingEvidenceCount > 0) {
            blockers.push({ blockerType: "budget_evidence_missing", count: budget.summary.missingEvidenceCount, title: "예산 증빙 누락 " + budget.summary.missingEvidenceCount + "건" });
        }
        if (budget.summary.pendingExpenseCount > 0) {
            blockers.push({ blockerType: "expense_pending", count: budget.summary.pendingExpenseCount, title: "처리 대기 지출결의서 " + budget.summary.pendingExpenseCount + "건" });
        }

        return Object.freeze({
            operationId: operation.operationId,
            operationVersion: operation.currentVersion,
            asOfDate: input.asOfDate,
            reportStatus: blockers.length ? "preparation_required" : "ready",
            summary: Object.freeze({
                plannedExecutionCount: plannedExecution,
                completedExecutionCount: completedExecution,
                remainingExecutionCount: plannedExecution - completedExecution,
                executionRate: plannedExecution ? Math.round(completedExecution / plannedExecution * 100) : 0,
                evidenceRequiredCount: completedDocumentCount,
                evidenceAttachedCount: documents.summary.attachedCount,
                evidenceMissingCount: documents.summary.missingCount,
                evidenceCompletionRate: evidenceCompletionRate,
                approvedBudget: budget.summary.approvedTotal,
                usedBudget: budget.summary.usedTotal,
                remainingBudget: budget.summary.remainingTotal,
                budgetUsageRate: budget.summary.usageRate,
                blockerCount: blockers.length
            }),
            unitProjects: Object.freeze(overview.unitProjects.map(function (unit) {
                return Object.freeze({
                    unitProjectId: unit.unitProjectId,
                    title: unit.title,
                    plannedCount: unit.plannedCount,
                    completedCount: unit.completedCount,
                    remainingCount: unit.remainingCount,
                    progressRate: unit.progressRate,
                    evidenceRequiredCount: unit.evidenceRequiredCount,
                    evidenceAttachedCount: unit.evidenceAttachedCount,
                    evidenceMissingCount: unit.evidenceMissingCount
                });
            })),
            reportSections: Object.freeze([
                { sectionId: "operation_summary", title: "사업 운영 실적", status: completedExecution ? "available" : "waiting" },
                { sectionId: "unit_project_results", title: "단위사업별 추진 결과", status: completedExecution ? "available" : "waiting" },
                { sectionId: "budget_settlement", title: "예산 집행 및 정산", status: budget.summary.pendingExpenseCount ? "waiting" : "available" },
                { sectionId: "evidence_appendix", title: "증빙자료 목록", status: documents.summary.missingCount ? "supplement_required" : "available" }
            ]),
            blockers: Object.freeze(blockers)
        });
    }

    projection.PerformanceReportProjector = Object.freeze({ project: project });
}(typeof globalThis !== "undefined" ? globalThis : this));
