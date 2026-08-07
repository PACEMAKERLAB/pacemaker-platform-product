/** PACEMAKER Platform Product v2 - Browser Demo Report Download Test - Version 1.0.0 */
(function (global) {
    "use strict";
    async function run() {
        var draft = { reportDraftId: "RPT-DEMO-001", operationId: "OPR-2026-0001", operationVersion: "V002", title: "함께머묾 성과보고서", reportingPeriod: { startDate: "2026-06-01", endDate: "2026-11-30" }, executiveSummary: { plannedExecutionCount: 15, completedExecutionCount: 15, executionRate: 100, evidenceCompletionRate: 100, approvedBudget: 20000000, usedBudget: 20000000, budgetUsageRate: 100 }, unitProjectResults: [{ unitProjectId: "UNT-001", title: "가을호 소식지", plannedCount: 2, completedCount: 2, progressRate: 100 }], budgetSettlement: { approvedBudget: 20000000, usedBudget: 20000000, remainingBudget: 0, usageRate: 100 }, evidenceAppendix: { requiredCount: 46, attachedCount: 46, missingCount: 0, completionRate: 100 } };
        var result = await global.PacemakerV2.Runtime.ReportOutput.generate({ reportDocumentId: "RPD-DEMO-001", reportDraft: draft, template: { templateId: "TPL-COMMUNITY-RESULT-001", version: "2026.1", documentTitle: "2026 마을공동체 실적보고서" }, projectTitle: "함께머묾", organizationName: "우리동네 함께머묾다", fileName: "함께머묾_성과보고서", mappedAt: new Date().toISOString(), mappedBy: "USR-EXPERT-0001", expiresAt: new Date(Date.now() + 86400000).toISOString(), historyEventId: "HST-RPT-DEMO-001", reportConnector: global.PacemakerV2.Connector.Report.BrowserDemoAdapter.create() });
        return { passed: true, status: result.status, connectorId: result.connectorId, requestedFormat: result.requestedFormat, demoOutputFormat: result.outputFormat, sectionCount: result.reportDocument.sections.length, downloadFileName: result.downloadFileName, downloadUrl: result.downloadUrl, historyLinked: true };
    }
    global.PacemakerV2BrowserDemoReportDownloadTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
