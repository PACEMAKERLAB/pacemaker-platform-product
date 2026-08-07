/** PACEMAKER Platform Product v2 - Storage Connector Contract Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    async function run() {
        var expense = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture.expenseResolutions[4]));
        var assetIds = expense.evidenceAssets.map(function (item) { return item.sourceAssetId; });
        var inspection = global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(expense, assetIds);
        var review = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({ expenseResolution: expense, decision: "approved", evidenceReview: inspection, executionState: {}, reviewedAt: "2026-08-07T21:00:00.000Z", reviewedBy: "USR-EXPERT-0001", historyEventId: "HST-EXPENSE-REVIEW-001" });
        var packageResult = global.PacemakerV2.Runtime.BotameSubmission.generate({ submissionPackageId: "BSP-2026-0001", expenseResolution: review.expenseResolution, operationVersion: "V002", projectTitle: "함께머묾", unitProjectTitle: "소통활동", categoryTitle: "일반운영비", generatedAt: "2026-08-07T21:10:00.000Z", generatedBy: "USR-EXPERT-0001", historyEventId: "HST-BOTAME-PACKAGE-001" });
        var storageConnector = global.PacemakerV2FakeStorageConnectorFixture.create();
        var result = await global.PacemakerV2.Runtime.BotameSubmissionDownload.prepare({
            submissionPackage: packageResult.submissionPackage,
            storageConnector: storageConnector,
            requestedAt: "2026-08-07T21:20:00.000Z",
            requestedBy: "USR-CUSTOMER-0001",
            expiresAt: "2026-08-08T21:20:00.000Z",
            historyEventId: "HST-BOTAME-ARCHIVE-001"
        });

        assert(storageConnector.calls.join(" -> ") === "resolveAssets -> createArchive -> createDownloadLink", "connector methods must run in contract order");
        assert(result.fileCount === 4, "archive must contain four submission files");
        assert(result.archiveName === "함께머묾_소통활동_4회차_보탬e_제출자료.zip", "archive name must come from PACEMAKER Engine");
        assert(result.historyEvent.eventType === "botame_submission_archive_created", "archive creation must create history");

        return {
            passed: true,
            connectorValid: true,
            connectorId: result.connectorId,
            callSequence: storageConnector.calls.join(" -> "),
            archiveFileCount: result.fileCount,
            archiveName: result.archiveName,
            downloadLinkCreated: !!result.downloadUrl,
            expiresAt: result.expiresAt,
            historyLinked: true
        };
    }
    global.PacemakerV2StorageConnectorContractTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
