/** PACEMAKER Platform Product v2 - Botam-e Submission Package Generation Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function run() {
        var expense = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture.expenseResolutions[4]));
        var assetIds = expense.evidenceAssets.map(function (item) { return item.sourceAssetId; });
        var inspection = global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(expense, assetIds);
        var review = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({
            expenseResolution: expense,
            decision: "approved",
            evidenceReview: inspection,
            executionState: {},
            reviewedAt: "2026-08-07T21:00:00.000Z",
            reviewedBy: "USR-EXPERT-0001",
            historyEventId: "HST-EXPENSE-REVIEW-001"
        });
        var result = global.PacemakerV2.Runtime.BotameSubmission.generate({
            submissionPackageId: "BSP-2026-0001",
            expenseResolution: review.expenseResolution,
            operationVersion: "V002",
            projectTitle: "함께머묾",
            unitProjectTitle: "소통활동",
            categoryTitle: "일반운영비",
            generatedAt: "2026-08-07T21:10:00.000Z",
            generatedBy: "USR-EXPERT-0001",
            historyEventId: "HST-BOTAME-PACKAGE-001"
        });
        var submissionPackage = result.submissionPackage;

        assert(submissionPackage.status === "download_ready", "submission package must be download ready");
        assert(submissionPackage.files.length === 4, "four reviewed evidence files must be included");
        assert(submissionPackage.manifest.missingFileCount === 0, "submission package must have no missing required files");
        assert(submissionPackage.downloadFileName.indexOf("소통활동_4회차") >= 0, "download name must identify unit project and round");
        assert(result.historyEvent.eventType === "botame_submission_package_generated", "package generation must create history");

        return {
            passed: true,
            expenseStatus: review.expenseResolution.status,
            packageStatus: submissionPackage.status,
            requiredFileCount: submissionPackage.manifest.requiredFileCount,
            includedFileCount: submissionPackage.manifest.includedFileCount,
            missingFileCount: submissionPackage.manifest.missingFileCount,
            downloadFileName: submissionPackage.downloadFileName,
            historyLinked: true
        };
    }
    global.PacemakerV2BotameSubmissionPackageGenerationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
