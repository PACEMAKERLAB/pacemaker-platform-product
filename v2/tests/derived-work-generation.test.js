/**
 * PACEMAKER Platform Product v2
 * Derived Work Generation Test
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    function expectError(callback, message) {
        var failed = false;

        try {
            callback();
        } catch (error) {
            failed = true;
        }

        assert(failed, message);
    }

    function createDraft() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(
            fixture.protocolRecommendation
        );

        return global.PacemakerV2.Engine.OperationGeneration.DraftGenerator.generate({
            operationId: "OPR-2026-0001",
            analysisResult: analysis,
            protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001",
            createdAt: "2026-08-07T12:00:00.000Z"
        });
    }

    function confirmOperation(draft) {
        var runtime = global.PacemakerV2.Runtime.OperationReview;
        var session = runtime.open(draft, {
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T12:01:00.000Z"
        });

        ["lifecycle", "unitProjects", "requiredDocuments", "approvedBudget"].forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section,
                expertId: "USR-EXPERT-0001",
                at: "2026-08-07T12:0" + (index + 2) + ":00.000Z"
            });
        });

        return runtime.confirm(session, {
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T12:10:00.000Z"
        }).operation;
    }

    function run() {
        var draft = createDraft();
        var confirmed;
        var first;
        var second;

        expectError(function () {
            global.PacemakerV2.Runtime.DerivedWork.execute(draft, { asOfDate: "2026-08-07" });
        }, "draft operation must not generate DerivedWork");

        confirmed = confirmOperation(draft);
        first = global.PacemakerV2.Runtime.DerivedWork.execute(confirmed, {
            asOfDate: "2026-08-07"
        });
        second = global.PacemakerV2.Runtime.DerivedWork.execute(confirmed, {
            asOfDate: "2026-08-07"
        });

        assert(JSON.stringify(first) === JSON.stringify(second), "same input must create identical DerivedWork");
        assert(first.summary.taskCount === 50, "lifecycle and occurrence tasks must be generated");
        assert(first.summary.scheduleCount === 5, "registered occurrence dates must create schedules");
        assert(first.summary.documentRequirementCount === 49, "documents must be generated per occurrence");
        assert(first.summary.checklistItemCount === 95, "tasks and documents must create checklist items");
        assert(first.summary.budgetCategoryCount === 1, "approved budget must create budget control");
        assert(first.summary.planningRequiredCount === 11, "missing occurrence plans must create alerts");

        return {
            passed: true,
            operationId: first.operationId,
            operationVersion: first.operationVersion,
            taskCount: first.summary.taskCount,
            scheduleCount: first.summary.scheduleCount,
            checklistItemCount: first.summary.checklistItemCount,
            documentRequirementCount: first.summary.documentRequirementCount,
            budgetCategoryCount: first.summary.budgetCategoryCount,
            planningRequiredCount: first.summary.planningRequiredCount,
            deterministic: JSON.stringify(first) === JSON.stringify(second)
        };
    }

    global.PacemakerV2DerivedWorkGenerationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
