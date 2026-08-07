/** PACEMAKER Platform Product v2 - Browser Demo Report Connector - Version 1.0.0 */
(function (global) {
    "use strict";
    var report = global.PacemakerV2.Connector.Report;

    function escapeHtml(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]; }); }
    function create() {
        var rendered = {};
        return {
            connectorId: "REPORT-BROWSER-DEMO-001",
            renderDocument: async function (request) {
                var reference = "browser-demo://report/" + request.reportDocument.reportDocumentId;
                var document = request.reportDocument;
                var sections = document.sections.map(function (section) { return '<section><h2>' + escapeHtml(section.title) + '</h2><pre>' + escapeHtml(JSON.stringify(section.data, null, 2)) + '</pre></section>'; }).join("");
                rendered[reference] = '<!DOCTYPE html><html lang="ko"><meta charset="UTF-8"><title>' + escapeHtml(document.title) + '</title><style>body{font-family:sans-serif;max-width:900px;margin:40px auto;color:#142d4a}header{border-bottom:3px solid #ff7a2f;padding-bottom:20px}section{margin-top:28px;page-break-inside:avoid}pre{white-space:pre-wrap;background:#f5f7fa;padding:16px}</style><header><h1>' + escapeHtml(document.title) + '</h1><p>' + escapeHtml(document.cover.projectTitle) + ' · ' + escapeHtml(document.cover.organizationName) + '</p></header>' + sections + '</html>';
                return { outputReference: reference, outputFormat: "html-demo", requestedFormat: document.outputFormat };
            },
            createDownloadLink: async function (request) {
                var blob = new Blob([rendered[request.outputReference]], { type: "text/html;charset=utf-8" });
                return { downloadUrl: URL.createObjectURL(blob), downloadFileName: request.fileName.replace(/\.pdf$/i, "_DemoConnector.html"), expiresAt: request.expiresAt };
            }
        };
    }
    report.BrowserDemoAdapter = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
