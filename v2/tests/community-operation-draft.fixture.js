/**
 * PACEMAKER Platform Product v2
 * Community Operation Draft Fixture
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    global.PacemakerV2CommunityOperationDraftFixture = Object.freeze({
        projectId: "PRJ-2026-0001",
        sourceAsset: {
            sourceAssetId: "AST-2026-0001",
            projectId: "PRJ-2026-0001",
            assetType: "approved_plan",
            fileName: "사업계획서_함께머묾.pdf",
            mimeType: "application/pdf",
            storageReference: "fixture://approved-plan",
            authority: "approved",
            uploadedBy: "USR-EXPERT-0001",
            now: "2026-08-07T10:00:00.000Z"
        },
        analysisResult: {
            analysisResultId: "ANL-2026-0001",
            projectId: "PRJ-2026-0001",
            sourceAssetIds: ["AST-2026-0001"],
            provider: "manual-fixture",
            analyzedAt: "2026-08-07T10:10:00.000Z",
            project: {
                title: "함께머묾 마을공동체",
                startDate: "2026-06-01",
                endDate: "2026-11-30"
            },
            lifecycle: [
                {
                    stageId: "STG-01",
                    title: "교부 및 착수",
                    order: 1,
                    tasks: [
                        { taskId: "LFT-001", title: "보조금 교부 상태 확인" },
                        { taskId: "LFT-002", title: "승인 계획과 예산 확인" }
                    ]
                },
                {
                    stageId: "STG-02",
                    title: "사업 실행",
                    order: 2,
                    tasks: [
                        { taskId: "LFT-003", title: "단위사업별 실행 현황 확인" }
                    ]
                },
                {
                    stageId: "STG-03",
                    title: "성과 및 정산",
                    order: 3,
                    tasks: [
                        { taskId: "LFT-004", title: "성과자료와 정산자료 확인" }
                    ]
                }
            ],
            unitProjects: [
                {
                    unitProjectId: "UNT-001",
                    title: "마을 소식지",
                    plannedCount: 3,
                    occurrenceDates: ["2026-07-31", "2026-08-31"],
                    preparationTasks: [
                        { taskCode: "prepare-content", title: "소식지 원고와 구성 준비" },
                        { taskCode: "confirm-production", title: "제작 일정과 담당자 확인" }
                    ],
                    requiredDocumentTypes: ["activity-plan", "photo", "expense-resolution"]
                },
                {
                    unitProjectId: "UNT-002",
                    title: "소통활동",
                    plannedCount: 12,
                    occurrenceDates: ["2026-06-20", "2026-07-18"],
                    preparationTasks: [
                        { taskCode: "confirm-instructor", title: "강사 또는 자체 진행 여부 확인" },
                        { taskCode: "prepare-attendance", title: "참석자 서명부 준비" },
                        { taskCode: "prepare-photo", title: "활동 사진 촬영 담당 확인" }
                    ],
                    requiredDocumentTypes: ["attendance", "photo", "expense-resolution"]
                }
            ],
            budget: {
                approved: [
                    { categoryId: "BGT-001", title: "사업운영비", amount: 20000000 }
                ]
            },
            requiredDocuments: [
                { documentType: "activity-plan", title: "활동 계획서" },
                { documentType: "attendance", title: "참석자 서명부" },
                { documentType: "photo", title: "활동 사진" },
                { documentType: "expense-resolution", title: "지출결의서" }
            ],
            extractionEvidence: [
                {
                    fieldPath: "project.title",
                    sourceAssetId: "AST-2026-0001",
                    page: 1,
                    excerpt: "함께머묾 마을공동체",
                    confidence: 0.99
                }
            ],
            warnings: []
        },
        protocolRecommendation: {
            recommendationId: "REC-2026-0001",
            analysisResultId: "ANL-2026-0001",
            projectId: "PRJ-2026-0001",
            protocolId: "PTC-COMMUNITY-001",
            protocolVersion: "1.0.0",
            confidence: 0.92,
            reasons: ["마을공동체 공모사업", "회차형 주민활동", "보조금 집행 및 정산"],
            gaps: ["기관별 변경신고 세부기준 전문가 확인 필요"],
            createdAt: "2026-08-07T10:15:00.000Z"
        }
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
