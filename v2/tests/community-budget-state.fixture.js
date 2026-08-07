/** PACEMAKER v2 Community Budget State Fixture */
(function (global) {
    "use strict";
    global.PacemakerV2CommunityBudgetStateFixture = Object.freeze({
        operationVersion: "V002",
        unitProjects: [
            { unitProjectId: "UNT-001", title: "가을호 소식지", plannedCount: 2, approvedAmount: 5000000 },
            { unitProjectId: "UNT-002", title: "소통활동", plannedCount: 12, approvedAmount: 11000000 },
            { unitProjectId: "UNT-003", title: "성과공유회", plannedCount: 1, approvedAmount: 4000000 }
        ],
        categories: [
            { categoryId: "BGT-101", title: "강사비", approvedAmount: 8000000, maxRate: 40, unitAllocations: { "UNT-001": 0, "UNT-002": 8000000, "UNT-003": 0 } },
            { categoryId: "BGT-102", title: "홍보·인쇄비", approvedAmount: 5000000, maxRate: 25, unitAllocations: { "UNT-001": 4000000, "UNT-002": 500000, "UNT-003": 500000 } },
            { categoryId: "BGT-103", title: "행사운영비", approvedAmount: 4000000, maxRate: 20, unitAllocations: { "UNT-001": 500000, "UNT-002": 1500000, "UNT-003": 2000000 } },
            { categoryId: "BGT-104", title: "일반운영비", approvedAmount: 3000000, maxRate: 15, unitAllocations: { "UNT-001": 500000, "UNT-002": 1000000, "UNT-003": 1500000 } }
        ],
        expenseResolutions: [
            { expenseResolutionId: "EXP-001", categoryId: "BGT-101", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R001", amount: 1600000, status: "approved", evidenceAttached: true },
            { expenseResolutionId: "EXP-002", categoryId: "BGT-101", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R002", amount: 1600000, status: "approved", evidenceAttached: true },
            { expenseResolutionId: "EXP-003", categoryId: "BGT-102", unitProjectId: "UNT-001", occurrenceId: "UNT-001-R001", amount: 2100000, status: "approved", evidenceAttached: true },
            { expenseResolutionId: "EXP-004", categoryId: "BGT-103", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R003", amount: 1700000, status: "approved", evidenceAttached: false },
            { expenseResolutionId: "EXP-005", categoryId: "BGT-104", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R004", amount: 600000, status: "pending", evidenceAttached: true }
        ]
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
