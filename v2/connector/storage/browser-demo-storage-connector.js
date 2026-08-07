/** PACEMAKER Platform Product v2 - Browser Demo Storage Connector - Version 1.0.0 */
(function (global) {
    "use strict";
    var storage = global.PacemakerV2.Connector.Storage;
    function create() {
        var archives = {};
        return {
            connectorId: "STORAGE-BROWSER-DEMO-001",
            resolveAssets: async function (request) {
                return { files: request.files.map(function (item) { return { fileName: item.fileName, sourceAssetId: item.sourceAssetId, contentReference: item.storageReference }; }) };
            },
            createArchive: async function (request) {
                var archiveReference = "browser-demo://archive/" + request.submissionPackageId;
                archives[archiveReference] = { archiveName: request.archiveName, manifest: request.manifest, files: request.files, demoNotice: "실제 원본 ZIP 생성은 외부 Storage Connector 연결 후 제공됩니다." };
                return { archiveName: request.archiveName, archiveReference: archiveReference };
            },
            createDownloadLink: async function (request) {
                var archive = archives[request.archiveReference];
                var blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json;charset=utf-8" });
                return { downloadUrl: URL.createObjectURL(blob), downloadFileName: archive.archiveName.replace(/\.zip$/i, "_DemoConnector.json"), expiresAt: request.expiresAt };
            }
        };
    }
    storage.BrowserDemoAdapter = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
