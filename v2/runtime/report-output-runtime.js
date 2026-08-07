/** PACEMAKER Platform Product v2 - Report Output Runtime - Version 1.0.0 */
(function (global) {
    "use strict";
    async function generate(input) {
        var connector = global.PacemakerV2.Connector.Report.Contract.assertValid(input.reportConnector);
        var reportDocument = global.PacemakerV2.Engine.ReportGeneration.ReportTemplateMapper.map(input);
        var rendered = await connector.renderDocument({ reportDocument: reportDocument });
        var download = await connector.createDownloadLink({ outputReference: rendered.outputReference, fileName: reportDocument.fileName, expiresAt: input.expiresAt });
        return Object.freeze({
            status: "download_ready", reportDocument: reportDocument, connectorId: connector.connectorId,
            outputFormat: rendered.outputFormat, requestedFormat: rendered.requestedFormat,
            downloadUrl: download.downloadUrl, downloadFileName: download.downloadFileName, expiresAt: download.expiresAt,
            historyEvent: Object.freeze({ historyEventId: input.historyEventId, eventType: "performance_report_output_generated", targetId: reportDocument.operationId, occurredAt: input.mappedAt, actorId: input.mappedBy, metadata: Object.freeze({ reportDocumentId: reportDocument.reportDocumentId, templateId: reportDocument.templateId, connectorId: connector.connectorId }) })
        });
    }
    global.PacemakerV2.Runtime.ReportOutput = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
