/** PACEMAKER Platform Product v2 - Report Template Mapper - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.ReportGeneration = engine.ReportGeneration || {};
    var reportGeneration = engine.ReportGeneration;

    function map(input) {
        var draft = input.reportDraft;
        var template = input.template;
        if (!draft || !template || !template.templateId) { throw new Error("보고서 초안과 기관 양식이 필요합니다."); }
        return Object.freeze({
            reportDocumentId: input.reportDocumentId,
            reportDraftId: draft.reportDraftId,
            operationId: draft.operationId,
            operationVersion: draft.operationVersion,
            templateId: template.templateId,
            templateVersion: template.version,
            outputFormat: "pdf",
            fileName: (input.fileName || draft.title).replace(/[\\/:*?"<>|]/g, "_") + ".pdf",
            title: template.documentTitle || draft.title,
            cover: Object.freeze({ projectTitle: input.projectTitle, reportingPeriod: draft.reportingPeriod, organizationName: input.organizationName }),
            sections: Object.freeze([
                Object.freeze({ sectionId: "summary", title: "사업 추진 개요", data: draft.executiveSummary }),
                Object.freeze({ sectionId: "results", title: "단위사업별 추진 실적", data: draft.unitProjectResults }),
                Object.freeze({ sectionId: "budget", title: "예산 집행 및 정산", data: draft.budgetSettlement }),
                Object.freeze({ sectionId: "evidence", title: "증빙자료 현황", data: draft.evidenceAppendix })
            ]),
            mappedAt: input.mappedAt,
            mappedBy: input.mappedBy
        });
    }

    reportGeneration.ReportTemplateMapper = Object.freeze({ map: map });
}(typeof globalThis !== "undefined" ? globalThis : this));
