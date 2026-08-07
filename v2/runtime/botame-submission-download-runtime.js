/** PACEMAKER Platform Product v2 - Botam-e Submission Download Runtime - Version 1.0.0 */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;

    async function prepare(input) {
        var submissionPackage = input.submissionPackage;
        var storageConnector = global.PacemakerV2.Connector.Storage.Contract.assertValid(input.storageConnector);
        var includedFiles;
        var resolved;
        var archive;
        var download;

        if (!submissionPackage || submissionPackage.status !== "download_ready") {
            throw new Error("다운로드 준비가 완료된 보탬e 제출자료만 처리할 수 있습니다.");
        }
        includedFiles = submissionPackage.files.filter(function (item) { return item.included; });
        if (!includedFiles.length || includedFiles.some(function (item) { return !item.storageReference; })) {
            throw new Error("Storage Connector에서 조회할 원본 파일 참조가 부족합니다.");
        }

        resolved = await storageConnector.resolveAssets({
            submissionPackageId: submissionPackage.submissionPackageId,
            files: includedFiles
        });
        archive = await storageConnector.createArchive({
            submissionPackageId: submissionPackage.submissionPackageId,
            archiveName: submissionPackage.downloadFileName,
            files: resolved.files,
            manifest: submissionPackage.manifest
        });
        download = await storageConnector.createDownloadLink({
            submissionPackageId: submissionPackage.submissionPackageId,
            archiveReference: archive.archiveReference,
            expiresAt: input.expiresAt
        });

        return Object.freeze({
            submissionPackageId: submissionPackage.submissionPackageId,
            connectorId: storageConnector.connectorId,
            fileCount: resolved.files.length,
            archiveName: archive.archiveName,
            archiveReference: archive.archiveReference,
            downloadUrl: download.downloadUrl,
            downloadFileName: download.downloadFileName || archive.archiveName,
            expiresAt: download.expiresAt,
            historyEvent: Object.freeze({
                historyEventId: input.historyEventId,
                eventType: "botame_submission_archive_created",
                targetId: submissionPackage.expenseResolutionId,
                occurredAt: input.requestedAt,
                actorId: input.requestedBy,
                metadata: {
                    connectorId: storageConnector.connectorId,
                    submissionPackageId: submissionPackage.submissionPackageId,
                    fileCount: resolved.files.length,
                    archiveReference: archive.archiveReference
                }
            })
        });
    }

    runtime.BotameSubmissionDownload = Object.freeze({ prepare: prepare });
}(typeof globalThis !== "undefined" ? globalThis : this));
