# PACEMAKER Platform Product Architecture

**Version:** 2.0.0
**Status:** MIGRATION BASELINE
**Foundation:** PACEMAKER Foundation 2.0.0
**Last Updated:** 2026-08-07

## 1. Product Identity

PACEMAKER는 AI Platform, ERP, 프로젝트 관리 도구가 아니다.
운영 전문가와 사용자가 사업의 계획부터 실행·증빙·성과까지 연결하는 Operating OS이다.

## 2. Official Layer Structure

```text
Product
├─ Experience
├─ Runtime
│  ├─ Engine
│  │  └─ Protocol
│  └─ Operation
└─ Connector
```

| 계층 | 책임 | 하지 않는 일 |
|---|---|---|
| Product | 역할별 제품 화면과 전체 운영 경험 | 외부 서비스 기능 복제 |
| Experience | 사용자·전문가에게 상태와 행동을 표현 | 운영 판단과 원본 데이터 확정 |
| Runtime | 계층 호출, 권한 확인, ChangeSet 적용 | 독자적인 AI 판단 |
| Engine | 분석, 추천, 도출, 영향분석, 판정 | 사용자 화면 렌더링 |
| Protocol | 사업 유형별 운영 지식과 규칙 | 개별 사업의 현재 상태 저장 |
| Operation | 확정된 개별 사업 운영 상태와 버전 | 범용 지식 정의 |
| Connector | 캘린더·메일·저장소·AI 등 외부 연동 | PACEMAKER 운영 규칙 소유 |

## 3. Official Creation Flow

```text
자료 등록
→ 문서 분석
→ 추천 Protocol
→ Draft Operation
→ 전문가 전체 검토
→ Operation 확정
→ 실행 항목 자동 도출
```

### Confirmation Boundary

- AI 분석 결과는 `Draft`이다.
- 전문가는 사업 생애주기의 모든 단계와 할 일을 확인한다.
- 전문가는 단계·단위사업·할 일·문서·일정·예산 규칙을 추가, 삭제, 수정할 수 있다.
- 확정 시 불변의 Operation Version을 생성한다.
- 현재 운영화면은 확정된 최신 Operation Version에서 도출한다.

## 4. Core Domain Objects

| 객체 | 핵심 내용 |
|---|---|
| SourceAsset | 사업계획서, 공고문, 예산서, 기관 템플릿 |
| AnalysisResult | AI가 추출한 사업·단위사업·일정·예산·제출 요건 |
| ProtocolRecommendation | 적용 가능한 Protocol과 근거·신뢰도 |
| OperationDraft | 전문가 검토 전 운영안 |
| OperationVersion | 전문가가 확정한 특정 시점의 운영 기준 |
| ChangeRequest | 계획변경·현황수정 요청과 사유 |
| ChangeSet | 승인된 변경의 적용 단위와 영향 범위 |
| DerivedWork | 할 일, 일정, 체크리스트, 필요 문서, 증빙, 예산 통제 |
| HistoryEvent | 생성·수정·확정·승인·완료 이력 |

## 5. Change and Impact Flow

확정 Operation은 직접 덮어쓰지 않는다.

1. 사용자 또는 전문가가 변경을 제안한다.
2. Engine이 일정·할 일·문서·예산·성과 영향을 계산한다.
3. 전문가가 영향분석 결과를 검토한다.
4. 승인된 ChangeSet만 Runtime이 적용한다.
5. 새 Operation Version과 HistoryEvent를 생성한다.

완료된 기록과 증빙은 보존하며, 변경 이후의 미완료 항목만 재도출하는 것을 기본으로 한다.

## 6. Connector Boundary

| 외부 기능 | PACEMAKER 처리 |
|---|---|
| Google Calendar | 사업 전용 캘린더 연결 및 일정 동기화 |
| Gmail | 메일 선택·사업/일정/단위사업 매핑 |
| Storage | 파일 보관 및 원본 링크 연결 |
| Meeting AI | 회의록 결과 수신 및 운영 항목 매핑 |
| OCR/PDF/범용 AI | 문서 텍스트·구조 추출 요청 |

Connector가 가져온 자료는 자동으로 공식 Operation을 변경하지 않는다.
매핑 또는 변경 제안 후 권한과 승인 규칙을 거친다.

## 7. Legacy Boundary

기존 `experience/`와 번호 기반 `runtime/01_context`~`11_result`는
기존 Growth Experience의 실행 보존 영역이다.

- 삭제하지 않는다.
- 신규 Operation의 공식 모델로 확장하지 않는다.
- 신규 구조와의 연결은 Adapter를 통해서만 허용한다.
- 마이그레이션 완료 전까지 Legacy 테스트를 유지한다.

## 8. Implementation Order

1. Operation Schema와 상태 전이
2. SourceAsset 등록 및 분석 계약
3. AnalysisResult와 Draft Operation 생성
4. 전문가 검토·확정 Experience
5. DerivedWork 생성 Engine
6. 홈·내 사업 화면 연결
7. 변경계획 및 영향분석
8. Connector 연결

첫 구현은 1~5의 단일 수직 흐름까지만 완료한다.
