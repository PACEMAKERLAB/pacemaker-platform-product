PACEMAKER Platform Naming Convention

Version: 1.0.0Status: OFFICIALApplies To: PACEMAKER Platform Product v2Foundation: PACEMAKER Foundation 2.0.0Last Updated: 2026-08-07

1. Purpose

이 문서는 기존 PACEMAKER 파일과 신규 v2 파일의 이름 충돌을 방지하고,파일명만으로 소속 도메인과 책임을 확인할 수 있도록 기준을 정의한다.

2. Application Boundary

기존 experience/, runtime/, protocols/ 파일은 이름과 위치를 변경하지 않는다.

신규 Foundation v2 구현은 모두 루트의 v2/ 폴더 아래에 생성한다.

이 규칙은 이 문서가 확정된 이후 생성되는 모든 신규 파일에 적용한다.

기존 코드는 마이그레이션 완료 전까지 Legacy 보존 영역으로 취급한다.

기존 코드를 legacy/로 물리적으로 이동하는 작업은 별도 승인 없이 진행하지 않는다.

3. Root Structure

pacemaker-platform-product/
├─ experience/              # 기존 Experience
├─ runtime/                 # 기존 Runtime
├─ protocols/               # 기존 Protocol
│
└─ v2/                      # 신규 Foundation v2 구현
   ├─ product/
   ├─ experience/
   ├─ engine/
   ├─ protocol/
   ├─ operation/
   ├─ connector/
   ├─ runtime/
   └─ tests/

4. General File Naming

모든 신규 파일명은 소문자 kebab-case를 사용한다.

기본 형식:

{domain}-{responsibility}.{extension}

허용 예시:

operation-model.js
operation-validator.js
operation-state-machine.js
operation-version-manager.js
document-analysis-engine.js
work-derivation-engine.js

신규 파일에서 다음과 같은 단독 이름은 사용하지 않는다.

model.js
runtime.js
index.js
generator.js
renderer.js
style.css
test.js

5. Layer Naming

계층

폴더

파일 접미 책임 예시

Product

v2/product/

-product, -service, -policy

Experience

v2/experience/

-page, -controller, -renderer, -style

Engine

v2/engine/

-engine, -rule, -evaluator

Protocol

v2/protocol/

-protocol, -schema, -validator

Operation

v2/operation/

-model, -schema, -state-machine, -manager

Connector

v2/connector/

-connector, -adapter, -client

Runtime

v2/runtime/

-runtime, -orchestrator

Test

v2/tests/

.test, .fixture

6. Operation File Examples

v2/operation/
├─ operation-model.js
├─ operation-schema.js
├─ operation-validator.js
├─ operation-state-machine.js
├─ operation-version-manager.js
└─ operation-history-manager.js

각 파일은 하나의 책임만 가진다.

7. Engine File Examples

v2/engine/
├─ document-analysis/
│  ├─ document-analysis-engine.js
│  └─ document-analysis-result-model.js
├─ protocol-recommendation/
│  └─ protocol-recommendation-engine.js
├─ operation-generation/
│  └─ operation-generation-engine.js
├─ work-derivation/
│  └─ work-derivation-engine.js
└─ impact-analysis/
   └─ impact-analysis-engine.js

Engine 폴더명과 파일명에는 처리 대상 도메인을 모두 표시한다.

8. Experience File Naming

화면 파일은 다음 형식을 사용한다.

{screen}-page.html
{screen}-controller.js
{screen}-renderer.js
{screen}-style.css

예시:

v2/experience/operation-review/
├─ operation-review-page.html
├─ operation-review-controller.js
├─ operation-review-renderer.js
└─ operation-review-style.css

Experience의 화면 동작은 controller가 담당한다.운영 계층을 호출하고 실행 순서를 관리하는 파일만 runtime 명칭을 사용한다.

9. Runtime File Naming

Runtime은 실행 대상과 행위를 파일명에 표시한다.

operation-creation-runtime.js
operation-confirmation-runtime.js
operation-change-runtime.js
derived-work-runtime.js

runtime.js 단독 이름은 사용하지 않는다.

10. Connector File Naming

google-calendar-connector.js
gmail-connector.js
storage-connector.js
meeting-ai-connector.js
document-ai-connector.js

외부 서비스별 상세 SDK 연결이 필요한 경우 다음처럼 구분한다.

google-calendar-client.js
google-calendar-adapter.js
google-calendar-connector.js

11. Test File Naming

{target-name}.test.js
{scenario-name}.fixture.js

예시:

operation-state-machine.test.js
operation-confirmation.test.js
community-project-plan.fixture.js

테스트 파일명은 검증 대상 또는 시나리오와 동일한 이름을 사용한다.

12. JavaScript Naming

대상

규칙

예시

Namespace

PascalCase

PacemakerV2

객체·클래스

PascalCase

OperationStateMachine

함수

camelCase

confirmOperation

변수

camelCase

operationVersion

상수

UPPER_SNAKE_CASE

OPERATION_STATUS

Boolean

상태형 접두어

isConfirmed, hasEvidence

신규 전역 객체를 개별 생성하지 않고 단일 namespace 아래에 등록한다.

PacemakerV2.Operation.Model
PacemakerV2.Operation.StateMachine
PacemakerV2.Engine.OperationGeneration
PacemakerV2.Runtime.OperationCreation

기존 PacemakerOperationRuntime 등 v1 전역 객체와 혼용하지 않는다.

13. Domain ID Naming

객체

접두어

예시

Project

PRJ

PRJ-2026-0001

SourceAsset

AST

AST-2026-0001

AnalysisResult

ANL

ANL-2026-0001

Protocol

PTC

PTC-COMMUNITY-001

Operation

OPR

OPR-2026-0001

OperationVersion

OPV

OPV-2026-0001-V001

Task

TSK

TSK-2026-0001

Schedule

SCH

SCH-2026-0001

Document

DOC

DOC-2026-0001

ChangeRequest

CHG

CHG-2026-0001

HistoryEvent

HST

HST-2026-0001

ID는 표시 이름이 아니라 시스템 식별자이며, 생성 후 변경하지 않는다.

14. Version Naming

문서와 모듈은 Semantic Versioning 형식 MAJOR.MINOR.PATCH를 사용한다.

Operation Version은 V001, V002처럼 3자리 증가 형식을 사용한다.

Draft 수정은 Operation Version을 증가시키지 않는다.

전문가 확정 또는 승인된 ChangeSet 적용 시 새 Operation Version을 생성한다.

15. Prohibited Patterns

신규 파일을 기존 runtime/에 바로 추가하지 않는다.

같은 이름의 파일을 여러 폴더에 반복 생성하지 않는다.

파일명에 new, final, real, latest, copy를 사용하지 않는다.

버전을 파일명 operation-v2-final.js처럼 기록하지 않는다.

외부 서비스 이름을 Engine 파일에 사용하지 않는다.

화면 파일에서 Operation 원본을 직접 변경하지 않는다.

16. Enforcement

신규 파일을 생성하기 전에 다음을 확인한다.

v2/ 아래에 위치하는가?

파일명에 도메인과 책임이 모두 나타나는가?

기존 파일명 또는 전역 객체와 충돌하지 않는가?

하나의 파일이 하나의 책임만 가지는가?

Product → Engine → Connector 구조와 일치하는가?

규칙 변경이 필요하면 구현 파일을 먼저 예외 처리하지 않고,이 문서를 개정한 후 CHANGE LOG에 근거를 기록한다.