/** PACEMAKER Platform Product v2 - Performance Report Runtime - Version 1.0.0 */
(function (global) {
    "use strict";

    function generate(input) {
        var draft = global.PacemakerV2.Engine.ReportGeneration.PerformanceReportDraftGenerator.generate(input);
        return Object.freeze({
            reportDraft: draft,
            historyEvent: Object.freeze({
                historyEventId: input.historyEventId,
                eventType: "performance_report_draft_generated",
                targetId: draft.operationId,
                occurredAt: input.generatedAt,
                actorId: input.generatedBy,
                metadata: Object.freeze({ reportDraftId: draft.reportDraftId, operationVersion: draft.operationVersion })
            })
        });
    }

    global.PacemakerV2.Runtime.PerformanceReport = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
