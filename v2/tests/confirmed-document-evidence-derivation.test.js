/** PACEMAKER Platform Product v2 - Confirmed Document Evidence Derivation Test - Version 1.0.0 */
(function (global) {
    "use strict";

    function assert(condition, message) {
        if (!condition) { throw new Error(message); }
    }

    function run() {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var operation = global.PacemakerV2.Operation.Model.create({
            operationId: "OPR-DOCUMENT-SCOPE-001",
            projectId: fixture.projectId,
            lifecycle: fixture.analysisResult.lifecycle,
            unitProjects: fixture.analysisResult.unitProjects,
            budget: fixture.analysisResult.budget,
            requiredDocuments: [
                { documentType: "activity-plan", title: "활동 계획서", required: true, purpose: "운영·예산 증빙", unitProjectId: "all", occurrenceScope: "all", categoryId: "all", botameSubmission: true, source: "expert_confirmed" },
                { documentType: "attendance", title: "참석자 서명부", required: true, purpose: "참여 증빙", unitProjectId: "UNT-002", occurrenceScope: "1,2", categoryId: "all", botameSubmission: true, source: "expert_confirmed" },
                { documentType: "photo", title: "활동 사진", required: true, purpose: "실행 증빙", unitProjectId: "all", occurrenceScope: "all", categoryId: "all", botameSubmission: true, source: "expert_confirmed" },
                { documentType: "expense-resolution", title: "지출결의서", required: false, purpose: "별도 예산 흐름에서 생성", unitProjectId: "all", occurrenceScope: "all", categoryId: "all", botameSubmission: false, source: "expert_confirmed" },
                { documentType: "change-plan", title: "변경계획서", required: true, purpose: "계획 변경·기관 제출", unitProjectId: "UNT-001", occurrenceScope: "2", categoryId: "all", botameSubmission: false, templateAssetId: "TPL-CHANGE-001", source: "expert_added" }
            ],
            createdBy: "USR-EXPERT-0001",
            now: "2026-08-07T13:00:00.000Z"
        });
        var derived;
        var changePlan;
        var communicationAttendance;

        operation.status = "confirmed";
        operation.currentVersion = "V001";
        derived = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: "2026-08-07" });
        changePlan = derived.documentRequirements.filter(function (item) { return item.documentType === "change-plan"; });
        communicationAttendance = derived.documentRequirements.filter(function (item) {
            return item.unitProjectId === "UNT-002" && item.documentType === "attendance";
        });

        assert(changePlan.length === 1, "change plan must be generated only for the confirmed round");
        assert(changePlan[0].occurrenceId === "UNT-001-R002", "change plan must target newsletter round 2");
        assert(changePlan[0].purpose === "계획 변경·기관 제출", "document purpose must be projected");
        assert(changePlan[0].templateAssetId === "TPL-CHANGE-001", "template reference must be projected");
        assert(communicationAttendance.length === 2, "attendance must follow expert-confirmed round scope");
        assert(derived.documentRequirements.filter(function (item) { return item.documentType === "expense-resolution"; }).length === 0, "optional document rule must suppress legacy defaults");
        assert(derived.documentRequirements.filter(function (item) { return item.botameSubmission; }).length > 0, "Botam-e submission metadata must remain");

        return {
            passed: true,
            operationVersion: operation.currentVersion,
            totalOccurrenceCount: operation.unitProjects.reduce(function (sum, item) { return sum + item.plannedCount; }, 0),
            generatedDocumentCount: derived.documentRequirements.length,
            scopedAttendanceCount: communicationAttendance.length,
            changePlanCount: changePlan.length,
            changePlanOccurrence: changePlan[0].occurrenceId,
            optionalExpenseResolutionCount: 0,
            metadataProjected: true
        };
    }

    global.PacemakerV2ConfirmedDocumentEvidenceDerivationTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
