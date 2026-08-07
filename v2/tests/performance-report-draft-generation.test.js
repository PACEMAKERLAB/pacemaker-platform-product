/** PACEMAKER Platform Product v2 - Performance Report Draft Generation Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function run() {
        var base = {
            operationId: "OPR-2026-0001", operationVersion: "V002", reportStatus: "preparation_required",
            summary: { plannedExecutionCount: 15, completedExecutionCount: 6, executionRate: 40, evidenceRequiredCount: 18, evidenceAttachedCount: 17, evidenceMissingCount: 1, evidenceCompletionRate: 94, approvedBudget: 20000000, usedBudget: 7600000, remainingBudget: 12400000, budgetUsageRate: 38 },
            unitProjects: [{ unitProjectId: "UNT-001", title: "가을호 소식지", plannedCount: 2, completedCount: 2, progressRate: 100, evidenceRequiredCount: 6, evidenceAttachedCount: 6 }],
            reportSections: [{ sectionId: "operation_summary", title: "사업 운영 실적", status: "available" }],
            blockers: [{ blockerType: "evidence_missing", count: 1, title: "증빙 누락 1건" }]
        };
        var blocked = false;
        try { global.PacemakerV2.Runtime.PerformanceReport.generate({ performanceView: base }); }
        catch (error) { blocked = error.code === "REPORT_NOT_READY" && error.blockers.length === 1; }
        assert(blocked, "unfinished report must be blocked");

        var ready = Object.assign({}, base, { reportStatus: "ready", blockers: [] });
        var result = global.PacemakerV2.Runtime.PerformanceReport.generate({
            reportDraftId: "RPT-2026-0001", performanceView: ready, projectTitle: "함께머묾 마을공동체",
            startDate: "2026-06-01", endDate: "2026-11-30", generatedAt: "2026-12-01T09:00:00.000Z",
            generatedBy: "USR-EXPERT-0001", historyEventId: "HST-REPORT-001"
        });
        assert(result.reportDraft.status === "draft", "generated report must be draft");
        assert(result.reportDraft.operationVersion === "V002", "report must preserve Operation version");
        assert(result.reportDraft.unitProjectResults.length === 1, "unit results must be included");
        assert(result.reportDraft.budgetSettlement.usedBudget === 7600000, "budget settlement must be included");
        assert(result.historyEvent.eventType === "performance_report_draft_generated", "history must be generated");
        return { passed: true, blockedBeforeReady: blocked, reportDraftId: result.reportDraft.reportDraftId, status: result.reportDraft.status, operationVersion: result.reportDraft.operationVersion, sectionCount: result.reportDraft.sections.length, unitProjectResultCount: result.reportDraft.unitProjectResults.length, historyLinked: true };
    }
    global.PacemakerV2PerformanceReportDraftGenerationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
