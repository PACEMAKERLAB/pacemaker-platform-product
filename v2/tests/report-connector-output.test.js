/** PACEMAKER Platform Product v2 - Report Connector Output Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }
    async function run() {
        var calls = [];
        var fake = { connectorId: "REPORT-FAKE-001", renderDocument: async function (request) { calls.push("renderDocument"); return { outputReference: "fake://RPT-DOC-001", outputFormat: "pdf", requestedFormat: request.reportDocument.outputFormat }; }, createDownloadLink: async function (request) { calls.push("createDownloadLink"); return { downloadUrl: "https://example.invalid/report.pdf", downloadFileName: request.fileName, expiresAt: request.expiresAt }; } };
        var draft = { reportDraftId: "RPT-001", operationId: "OPR-001", operationVersion: "V002", title: "함께머묾 성과보고서", reportingPeriod: { startDate: "2026-06-01", endDate: "2026-11-30" }, executiveSummary: { executionRate: 100 }, unitProjectResults: [{ title: "소통활동", completedCount: 12 }], budgetSettlement: { usedBudget: 20000000 }, evidenceAppendix: { missingCount: 0 } };
        var result = await global.PacemakerV2.Runtime.ReportOutput.generate({ reportDocumentId: "RPD-001", reportDraft: draft, template: { templateId: "TPL-COMMUNITY-RESULT-001", version: "2026.1", documentTitle: "2026 마을공동체 실적보고서" }, projectTitle: "함께머묾", organizationName: "우리동네 함께머묾다", mappedAt: "2026-12-01T09:00:00.000Z", mappedBy: "USR-EXPERT-0001", expiresAt: "2026-12-02T09:00:00.000Z", historyEventId: "HST-RPT-001", reportConnector: fake });
        assert(result.status === "download_ready", "report output must be ready"); assert(result.reportDocument.sections.length === 4, "four report sections must be mapped"); assert(result.requestedFormat === "pdf", "PDF must be requested"); assert(calls.join(" -> ") === "renderDocument -> createDownloadLink", "connector call sequence must match"); assert(result.historyEvent.eventType === "performance_report_output_generated", "history must be generated");
        return { passed: true, connectorValid: true, templateId: result.reportDocument.templateId, requestedFormat: result.requestedFormat, connectorOutputFormat: result.outputFormat, sectionCount: result.reportDocument.sections.length, callSequence: calls.join(" -> "), downloadReady: true, historyLinked: true };
    }
    global.PacemakerV2ReportConnectorOutputTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
