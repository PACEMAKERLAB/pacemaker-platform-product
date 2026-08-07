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
            { expenseResolutionId: "EXP-001", categoryId: "BGT-101", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R001", amount: 1600000, status: "botame_completed", evidenceAttached: true },
            { expenseResolutionId: "EXP-002", categoryId: "BGT-101", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R002", amount: 1600000, status: "botame_completed", evidenceAttached: true },
            { expenseResolutionId: "EXP-003", categoryId: "BGT-102", unitProjectId: "UNT-001", occurrenceId: "UNT-001-R001", amount: 2100000, status: "botame_completed", evidenceAttached: true },
            { expenseResolutionId: "EXP-004", categoryId: "BGT-103", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R003", amount: 1700000, status: "botame_completed", evidenceAttached: false },
            { expenseResolutionId: "EXP-005", categoryId: "BGT-104", unitProjectId: "UNT-002", occurrenceId: "UNT-002-R004", amount: 600000, status: "expert_review_pending", evidenceAttached: true,
                evidenceRequirements: [
                    { documentType: "expense-resolution", title: "지출결의서", required: true },
                    { documentType: "expense-approval", title: "지출품의서", required: true },
                    { documentType: "receipt", title: "영수증·세금계산서", required: true },
                    { documentType: "transfer-proof", title: "이체확인증", required: true }
                ],
                evidenceAssets: [
                    { sourceAssetId: "AST-EXP-005-01", documentType: "expense-resolution", fileName: "소통활동_4회차_지출결의서.pdf", storageReference: "browser-session://expense-resolution.pdf" },
                    { sourceAssetId: "AST-EXP-005-02", documentType: "expense-approval", fileName: "소통활동_4회차_지출품의서.pdf", storageReference: "browser-session://expense-approval.pdf" },
                    { sourceAssetId: "AST-EXP-005-03", documentType: "receipt", fileName: "일반운영비_영수증.pdf", storageReference: "browser-session://receipt.pdf" },
                    { sourceAssetId: "AST-EXP-005-04", documentType: "transfer-proof", fileName: "일반운영비_이체확인증.pdf", storageReference: "browser-session://transfer-proof.pdf" }
                ] }
        ]
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
