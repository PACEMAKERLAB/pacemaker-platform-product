/** PACEMAKER Platform Product v2 - Community Manual Analysis Fixture - Version 1.0.0 */
(function (global) {
    "use strict";

    global.PacemakerV2CommunityManualAnalysisFixture = Object.freeze({
        domain: {
            programName: "2026년 울산광역시 마을공동체 만들기 공모사업",
            programType: "community_grant",
            jurisdiction: "울산광역시",
            year: 2026
        },
        sourceAssetIds: ["AST-MANUAL-001", "AST-SCHEDULE-001", "AST-EXPENSE-001", "AST-BOTAME-001"],
        generatedBy: { provider: "manual-analysis-fixture", model: null },
        lifecycleStages: [
            { stageCode: "organization_setup", title: "단체 기반 준비", order: 1 },
            { stageCode: "plan_and_grant", title: "수행사업계획 및 교부", order: 2 },
            { stageCode: "execution", title: "사업 수행 및 집행", order: 3 },
            { stageCode: "closing", title: "실적·정산·공시", order: 4 }
        ],
        sourceEvidences: [
            {
                sourceEvidenceId: "EVD-001",
                sourceAssetId: "AST-SCHEDULE-001",
                fileName: "추진일정 및 이행사항 안내 - 2026년 마을공동체 만들기 공모사업.pdf",
                page: 3,
                section: "보조금 교부 신청",
                excerpt: "교부신청 첨부서류 6종",
                confidence: 0.99
            },
            {
                sourceEvidenceId: "EVD-002",
                sourceAssetId: "AST-BOTAME-001",
                fileName: "2026 보탬e 시스템 매뉴얼.pdf",
                page: 66,
                section: "집행등록",
                excerpt: "집행 건별 증빙자료 등록 및 파일 첨부",
                confidence: 0.97
            },
            {
                sourceEvidenceId: "EVD-003",
                sourceAssetId: "AST-BOTAME-001",
                fileName: "2026 보탬e 시스템 매뉴얼.pdf",
                page: 72,
                section: "인적지급",
                excerpt: "강사비·공연비 실지급액과 원천징수액 구분",
                confidence: 0.96
            }
        ],
        requirementRules: [
            {
                requirementRuleId: "DRR-GRANT-001",
                title: "보조금 교부신청서",
                obligation: "required",
                stageCode: "plan_and_grant",
                timing: "before_project",
                appliesTo: { projectWide: true, unitProjectTypes: [], occurrenceScope: "none", expenseTypes: [] },
                document: { documentType: "grant-application", templateRequired: true },
                submission: { destination: "보탬e", externalService: "botame", menuCode: "92016" },
                completionCriteria: ["작성 완료", "보탬e 첨부 완료"],
                sourceEvidenceIds: ["EVD-001"],
                confidence: 0.99
            },
            {
                requirementRuleId: "DRR-EXPENSE-001",
                title: "집행 건별 증빙자료",
                obligation: "required",
                stageCode: "execution",
                timing: "per_expense",
                appliesTo: { projectWide: false, unitProjectTypes: [], occurrenceScope: "expense", expenseTypes: ["all"] },
                document: { documentType: "expense-evidence", templateRequired: false },
                submission: { destination: "보탬e", externalService: "botame" },
                completionCriteria: ["집행정보 입력", "증빙파일 첨부"],
                sourceEvidenceIds: ["EVD-002"],
                confidence: 0.97
            },
            {
                requirementRuleId: "DRR-INSTRUCTOR-001",
                title: "강사비 지급 및 원천징수 자료",
                obligation: "conditional",
                stageCode: "execution",
                timing: "per_expense",
                appliesTo: { projectWide: false, unitProjectTypes: ["education", "communication"], occurrenceScope: "matched_occurrence", expenseTypes: ["instructor_fee", "performance_fee"] },
                condition: { field: "expense.type", operator: "in", values: ["instructor_fee", "performance_fee"] },
                document: { documentType: "human-payment-evidence", templateRequired: false },
                submission: { destination: "보탬e", externalService: "botame" },
                completionCriteria: ["실지급액 이체", "원천징수액 구분", "원천세 신고·납부"],
                sourceEvidenceIds: ["EVD-003"],
                confidence: 0.96
            }
        ],
        externalActions: [
            { externalActionId: "EXT-BOTAME-001", service: "botame", action: "grant_application", menuCode: "92016", stageCode: "plan_and_grant" },
            { externalActionId: "EXT-BOTAME-002", service: "botame", action: "expense_registration", menuCode: "93001", stageCode: "execution" }
        ],
        conflicts: [],
        gaps: ["사업비 집행 안내자료의 지출유형별 세부 증빙을 추가 분석해야 함"]
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
