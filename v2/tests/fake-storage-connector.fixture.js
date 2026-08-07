/** PACEMAKER Platform Product v2 - Fake Storage Connector Fixture - Version 1.0.0 */
(function (global) {
    "use strict";
    function create() {
        var calls = [];
        return {
            connectorId: "STORAGE-FAKE-001",
            calls: calls,
            resolveAssets: async function (request) {
                calls.push("resolveAssets");
                return {
                    files: request.files.map(function (item) {
                        return { fileName: item.fileName, sourceAssetId: item.sourceAssetId, contentReference: "fixture-content://" + item.sourceAssetId };
                    })
                };
            },
            createArchive: async function (request) {
                calls.push("createArchive");
                return { archiveName: request.archiveName, archiveReference: "connector://storage/archive/" + request.submissionPackageId };
            },
            createDownloadLink: async function (request) {
                calls.push("createDownloadLink");
                return { downloadUrl: "https://storage-fixture.invalid/download/" + request.submissionPackageId, expiresAt: request.expiresAt };
            }
        };
    }
    global.PacemakerV2FakeStorageConnectorFixture = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
