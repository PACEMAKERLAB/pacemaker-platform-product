/**
 * PACEMAKER Platform Product v2
 * Operation Expert Review Test
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
        var analysis = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(
            fixture.analysisResult
        );
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(
            fixture.protocolRecommendation
        );

        return global.PacemakerV2.Engine.OperationGeneration.DraftGenerator.generate({
            operationId: "OPR-2026-0001",
            analysisResult: analysis,
            protocolRecommendation: recommendation,
            createdBy: "USR-EXPERT-0001",
            createdAt: "2026-08-07T11:00:00.000Z"
        });
    }

    function run() {
        var runtime = global.PacemakerV2.Runtime.OperationReview;
        var session = runtime.open(createDraft(), {
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T11:10:00.000Z"
        });
        var sections = ["lifecycle", "unitProjects", "requiredDocuments", "approvedBudget"];

        session = runtime.edit(session, {
            section: "unitProjects",
            action: "update",
            itemId: "UNT-001",
            changes: {
                title: "가을호 소식지",
                plannedCount: 2,
                changeNote: "여름호는 교육 사업으로 대체 예정"
            },
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T11:20:00.000Z"
        });

        session = runtime.edit(session, {
            section: "requiredDocuments",
            action: "add",
            item: {
                documentType: "change-plan",
                title: "변경계획서", required: true, purpose: "계획 변경·기관 제출", botameSubmission: false,
                unitProjectId: "UNT-001", occurrenceScope: "all", categoryId: "all", source: "expert_added"
            },
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T11:21:00.000Z"
        });

        expectError(function () {
            runtime.confirm(session, {
                expertId: "USR-EXPERT-0001",
                at: "2026-08-07T11:22:00.000Z"
            });
        }, "operation confirmation must be blocked before every section is reviewed");

        sections.forEach(function (section, index) {
            session = runtime.confirmSection(session, {
                section: section,
                expertId: "USR-EXPERT-0001",
                at: "2026-08-07T11:3" + index + ":00.000Z"
            });
        });

        session = runtime.confirm(session, {
            expertId: "USR-EXPERT-0001",
            at: "2026-08-07T11:40:00.000Z"
        });

        assert(session.operation.status === "confirmed", "reviewed operation must be confirmed");
        assert(session.operation.currentVersion === "V001", "first expert confirmation must create V001");
        assert(session.operation.unitProjects[0].plannedCount === 2, "expert edit must remain");
        assert(session.operation.requiredDocuments.length === 5, "expert document addition must remain");
        assert(session.operation.requiredDocuments[4].unitProjectId === "UNT-001", "document scope must remain");
        assert(session.operation.requiredDocuments[4].purpose === "계획 변경·기관 제출", "document purpose must remain");
        assert(session.historyEvents.length === 9, "review actions must create history events");

        return {
            passed: true,
            operationId: session.operation.operationId,
            status: session.operation.status,
            version: session.operation.currentVersion,
            reviewedSections: sections.length,
            unitProjectTitle: session.operation.unitProjects[0].title,
            requiredDocumentCount: session.operation.requiredDocuments.length,
            documentScope: session.operation.requiredDocuments[4].unitProjectId,
            documentPurpose: session.operation.requiredDocuments[4].purpose,
            historyEventCount: session.historyEvents.length
        };
    }

    global.PacemakerV2OperationExpertReviewTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
