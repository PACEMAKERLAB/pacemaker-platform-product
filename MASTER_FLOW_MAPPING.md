# PACEMAKER Platform Master Flow Mapping

**Version:** 2.0.0
**Status:** MIGRATION BASELINE
**Foundation:** PACEMAKER Foundation 2.0.0
**Last Updated:** 2026-08-07

## 1. Official Product Flow

PACEMAKER Platform Product의 공식 운영 흐름은 다음과 같다.

```text
Contract
→ Source Asset Registration
→ AI Analysis
→ Protocol Recommendation
→ Draft Operation Generation
→ Expert Review
→ Operation Confirmation
→ Operation Execution
→ Evidence and Budget Control
→ Change and Impact Analysis
→ Performance Report
→ History and Reuse
```

이 흐름은 개별 기능의 나열이 아니라 사업의 전체 생애주기이다.

## 2. Foundation Layer Mapping

| Product Flow | Foundation 책임 | 주요 결과 |
|---|---|---|
| 계약 및 사업 생성 | Product / Runtime | Project, 권한, 담당자 |
| 자료 등록 | Product / Connector | SourceAsset |
| AI 분석 | Engine / Connector | AnalysisResult |
| Protocol 추천 | Engine → Protocol | ProtocolRecommendation |
| 운영안 생성 | Engine | OperationDraft |
| 전문가 검토 | Experience / Runtime | ReviewDecision |
| Operation 확정 | Runtime / Operation | OperationVersion |
| 실행 항목 도출 | Engine / Operation | DerivedWork |
| 실행·증빙·예산 관리 | Product / Operation | Task, Schedule, Evidence, Budget Status |
| 변경 영향분석 | Engine / Operation | ChangeRequest, ImpactResult, ChangeSet |
| 성과보고 | Engine / Operation / Connector | PerformanceResult, ReportAsset |
| 이력과 재사용 | Operation / Protocol | HistoryEvent, Confirmed Pattern |

## 3. Operation Creation Flow

### 3.1 Input

- 승인 사업계획서
- 공고문과 운영지침
- 승인 예산서
- 기관 제공 서식과 템플릿
- 계약 정보와 운영자 기본정보

### 3.2 AI Recommendation

Engine은 입력 자료에서 다음 내용을 추출하고 추천한다.

- 사업 목표와 기간
- 단위사업과 회차
- 일정과 마감
- 승인 예산과 항목별 제한
- 필수 제출 문서와 증빙
- 적용 가능한 Protocol
- 생애주기별 단계와 할 일

AI 결과는 공식 계획이 아니라 검토 가능한 Draft이다.

### 3.3 Expert Confirmation

전문가는 전체 생애주기를 확인하고 다음 작업을 수행할 수 있다.

- 단계·단위사업·회차 확인
- 할 일 추가·삭제·수정
- 일정과 담당자 수정
- 필요 문서와 증빙 보완
- 예산 항목과 제한 확인
- AI 추출 근거 확인
- Operation 확정

확정 후에만 Operation Version과 실행 항목을 생성한다.

## 4. Confirmed Operation Flow

```text
Confirmed Operation Version
├─ Task
├─ Schedule
├─ Checklist
├─ Required Document
├─ Evidence Requirement
├─ Budget Control
├─ Approval Request
└─ Performance Requirement
```

홈과 내 사업 화면은 각각 별도 기준을 만들지 않고,
동일한 확정 Operation에서 역할과 시점에 맞는 정보를 조회한다.

## 5. Change Flow

계획 변경이나 운영 현황 수정은 확정 Operation을 직접 덮어쓰지 않는다.

```text
Change Proposal
→ Impact Analysis
→ Expert Review
→ Approval
→ ChangeSet Application
→ New Operation Version
→ DerivedWork Recalculation
```

- 완료된 활동과 증빙은 보존한다.
- 영향을 받는 미완료 항목을 중심으로 재계산한다.
- 변경 전후 내용과 승인자는 HistoryEvent로 기록한다.

## 6. Product Experience Mapping

| 화면 | Operation에서 보여줄 내용 |
|---|---|
| 홈 | 여러 사업의 지금 확인할 일, 운영자 요청, 메일, 다음 예정, 월·주 일정 |
| 내 사업 개요 | 사업 요약, 단위사업, 승인·사용 예산, 전체 진행 위치 |
| 운영계획 | 단위사업별 단계, 회차, 전체 체크리스트, 변경 상태 |
| 실행 | 이번 일정의 준비 현황, 할 일, 담당자, 준비자료 |
| 자료·문서 | 활동·회차별 필수 문서와 증빙 첨부 여부 |
| 요청·승인 | 변경, 상담, 승인, 전문가 검토 요청 |
| 성과보고 | 목표 대비 실적, 예산, 증빙 완결성, 결과물 |
| 고객관리 | 전문가 전용 고객 이력, 과거 사업, 다음 사업 제안 |

## 7. Connector Mapping

| Connector | Flow 연결 지점 |
|---|---|
| Google Calendar | 확정 일정 동기화와 외부 일정 변경 제안 |
| Gmail | 메일을 사업·단위사업·일정·요청에 매핑 |
| Storage | SourceAsset, 준비자료, 증빙, 결과물 보관 |
| Meeting AI | 회의 결과를 기록·할 일·변경 제안에 매핑 |
| OCR/PDF/AI | 문서 구조 추출과 추천안 생성 지원 |

Connector 데이터만으로 Operation을 자동 확정하지 않는다.

## 8. Legacy Growth Experience Flow

기존 흐름은 삭제하지 않고 기존 Growth Experience로 보존한다.

```text
Dream
→ Journey
→ Case
→ Thinking
→ Action
→ Growth
```

기존 구현 위치:

- `experience/start`
- `experience/understand`
- `experience/reflection`
- `experience/analyze`
- `experience/interpretation`
- `experience/judgment`
- `experience/recommendation`
- `experience/action`
- `experience/growth`
- `experience/result`
- `experience/care`
- `experience/continue`

이 흐름은 v2 Operation Product Flow의 공식 실행 모델이 아니다.
필요한 경험 자산은 Adapter를 통해 새 Product Experience에서 재사용한다.

## 9. First Implementation Boundary

첫 구현은 다음 경계까지만 연결한다.

```text
SourceAsset
→ AnalysisResult
→ ProtocolRecommendation
→ OperationDraft
→ Expert Review
→ OperationVersion
→ DerivedWork
```

외부 Connector 실연동, 변경 영향분석, 고객 추천 사업은 후속 구현으로 분리한다.
