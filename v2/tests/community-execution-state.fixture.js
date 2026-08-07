/**
 * PACEMAKER Platform Product v2
 * Community Execution State Fixture
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    function documentKey(unitProjectId, round, documentType) {
        return unitProjectId + "-R" + String(round).padStart(3, "0") + ":" + documentType;
    }

    function createDocumentStatus() {
        var status = {};
        var round;

        for (round = 1; round <= 6; round += 1) {
            status[documentKey("UNT-002", round, "attendance")] = "attached";
            status[documentKey("UNT-002", round, "photo")] = round === 6 ? "missing" : "attached";
            status[documentKey("UNT-002", round, "expense-resolution")] = round === 5 ? "missing" : "attached";
        }

        return status;
    }

    global.PacemakerV2CommunityExecutionStateFixture = Object.freeze({
        asOfDate: "2026-08-07",
        currentStageId: "STG-02",
        completedOccurrences: {
            "UNT-001": 0,
            "UNT-002": 6,
            "UNT-003": 0
        },
        documentStatus: createDocumentStatus(),
        usedBudget: [
            {
                categoryId: "BGT-001",
                amount: 7600000,
                source: "expense_resolutions"
            }
        ],
        operatorRequests: [
            {
                requestId: "REQ-2026-0001",
                title: "여름호 대체 변경계획서를 등록해주세요.",
                dueDate: "2026-08-12",
                priority: "high"
            }
        ]
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
