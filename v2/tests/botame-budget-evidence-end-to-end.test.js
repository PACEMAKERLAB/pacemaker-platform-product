/** PACEMAKER Platform Product v2 - Botam-e Budget Evidence End-to-End Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    async function run() {
        var budgetState = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
        var pendingIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.status === "expert_review_pending"; });
        var pendingExpense = budgetState.expenseResolutions[pendingIndex];
        var executionState = {};
        var history = [];
        var before = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
        var inspection = global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(
            pendingExpense,
            pendingExpense.evidenceAssets.map(function (item) { return item.sourceAssetId; })
        );
        var review = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({
            expenseResolution: pendingExpense, decision: "approved", evidenceReview: inspection,
            executionState: executionState, reviewedAt: "2026-08-07T22:00:00.000Z", reviewedBy: "USR-EXPERT-0001",
            historyEventId: "HST-E2E-REVIEW-001"
        });
        budgetState.expenseResolutions[pendingIndex] = review.expenseResolution;
        executionState = review.executionState;
        history.push(review.historyEvent);
        var afterReview = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });

        var packageResult = global.PacemakerV2.Runtime.BotameSubmission.generate({
            submissionPackageId: "BSP-E2E-001", expenseResolution: review.expenseResolution,
            operationVersion: budgetState.operationVersion, projectTitle: "함께머묾", unitProjectTitle: "소통활동",
            categoryTitle: "일반운영비", generatedAt: "2026-08-07T22:01:00.000Z", generatedBy: "USR-EXPERT-0001",
            historyEventId: "HST-E2E-PACKAGE-001"
        });
        history.push(packageResult.historyEvent);

        var archive = await global.PacemakerV2.Runtime.BotameSubmissionDownload.prepare({
            submissionPackage: packageResult.submissionPackage,
            storageConnector: global.PacemakerV2FakeStorageConnectorFixture.create(),
            requestedAt: "2026-08-07T22:02:00.000Z", requestedBy: "USR-CUSTOMER-0001",
            expiresAt: "2026-08-08T22:02:00.000Z", historyEventId: "HST-E2E-ARCHIVE-001"
        });
        history.push(archive.historyEvent);

        var completion = global.PacemakerV2.Runtime.BotameCompletion.complete({
            expenseResolution: review.expenseResolution, executionState: executionState,
            completedAt: "2026-08-07T22:03:00.000Z", completedBy: "USR-CUSTOMER-0001",
            historyEventId: "HST-E2E-COMPLETE-001"
        });
        budgetState.expenseResolutions[pendingIndex] = completion.expenseResolution;
        executionState = completion.executionState;
        history.push(completion.historyEvent);
        var after = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });

        assert(before.summary.usedTotal === 7000000, "initial used budget must be 7,000,000");
        assert(afterReview.summary.usedTotal === 7000000, "expert review must not change used budget");
        assert(packageResult.submissionPackage.manifest.missingFileCount === 0, "submission package must have no missing files");
        assert(archive.fileCount === 4 && !!archive.downloadUrl, "storage connector must create a four-file download");
        assert(after.summary.usedTotal === 7600000, "Botam-e completion must increase used budget to 7,600,000");
        assert(after.summary.remainingTotal === 12400000 && after.summary.usageRate === 38, "remaining budget and usage rate must refresh");
        assert(after.summary.pendingExpenseCount === 0, "no expense must remain pending");
        assert(executionState.documentWorkflowStatus[completion.documentKey] === "evidence_completed", "evidence workflow must be completed");
        assert(history.length === 4, "review, package, archive and completion history must remain");

        return {
            passed: true,
            beforeUsedBudget: before.summary.usedTotal,
            afterExpertReviewUsedBudget: afterReview.summary.usedTotal,
            submissionFileCount: packageResult.submissionPackage.files.length,
            submissionMissingCount: packageResult.submissionPackage.manifest.missingFileCount,
            storageDownloadReady: !!archive.downloadUrl,
            finalExpenseStatus: completion.expenseResolution.status,
            afterBotameUsedBudget: after.summary.usedTotal,
            remainingBudget: after.summary.remainingTotal,
            usageRate: after.summary.usageRate,
            pendingExpenseCount: after.summary.pendingExpenseCount,
            evidenceWorkflowStatus: executionState.documentWorkflowStatus[completion.documentKey],
            historyEventCount: history.length,
            deterministic: true
        };
    }
    global.PacemakerV2BotameBudgetEvidenceEndToEndTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
