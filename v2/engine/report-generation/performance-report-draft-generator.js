/** PACEMAKER Platform Product v2 - Performance Report Draft Generator - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.ReportGeneration = engine.ReportGeneration || {};

    function freezeList(list) {
        return Object.freeze(list.map(function (item) { return Object.freeze(item); }));
    }

    function generate(input) {
        var report = input.performanceView;
        if (!report) { throw new Error("performanceView is required"); }
        if (report.reportStatus !== "ready") {
            var blocked = new Error("보고서 생성 전 확인사항을 먼저 완료해주세요.");
            blocked.code = "REPORT_NOT_READY";
            blocked.blockers = report.blockers;
            throw blocked;
        }

        var summary = report.summary;
        return Object.freeze({
            reportDraftId: input.reportDraftId,
            operationId: report.operationId,
            operationVersion: report.operationVersion,
            status: "draft",
            title: (input.projectTitle || "사업") + " 성과보고서",
            reportingPeriod: Object.freeze({ startDate: input.startDate, endDate: input.endDate }),
            generatedAt: input.generatedAt,
            generatedBy: input.generatedBy,
            executiveSummary: Object.freeze({
                plannedExecutionCount: summary.plannedExecutionCount,
                completedExecutionCount: summary.completedExecutionCount,
                executionRate: summary.executionRate,
                evidenceCompletionRate: summary.evidenceCompletionRate,
                approvedBudget: summary.approvedBudget,
                usedBudget: summary.usedBudget,
                budgetUsageRate: summary.budgetUsageRate
            }),
            unitProjectResults: freezeList(report.unitProjects.map(function (unit) {
                return {
                    unitProjectId: unit.unitProjectId,
                    title: unit.title,
                    plannedCount: unit.plannedCount,
                    completedCount: unit.completedCount,
                    progressRate: unit.progressRate,
                    evidenceRequiredCount: unit.evidenceRequiredCount,
                    evidenceAttachedCount: unit.evidenceAttachedCount
                };
            })),
            budgetSettlement: Object.freeze({
                approvedBudget: summary.approvedBudget,
                usedBudget: summary.usedBudget,
                remainingBudget: summary.remainingBudget,
                usageRate: summary.budgetUsageRate
            }),
            evidenceAppendix: Object.freeze({
                requiredCount: summary.evidenceRequiredCount,
                attachedCount: summary.evidenceAttachedCount,
                missingCount: summary.evidenceMissingCount,
                completionRate: summary.evidenceCompletionRate
            }),
            sections: freezeList(report.reportSections.map(function (section) {
                return { sectionId: section.sectionId, title: section.title, status: "included" };
            }))
        });
    }

    engine.ReportGeneration.PerformanceReportDraftGenerator = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
