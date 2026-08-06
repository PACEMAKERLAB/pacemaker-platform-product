# PACEMAKER Platform Product

**Version:** 2.0.0
**Status:** MIGRATION BASELINE
**Foundation:** PACEMAKER Foundation 2.0.0
**Last Updated:** 2026-08-07

PACEMAKER는 운영 전문가가 사업계획을 실제 실행 가능한 Operation으로 전환하고,
일정·할 일·문서·증빙·예산·승인·성과를 연결하여 운영하는 Operating OS이다.

PACEMAKER는 범용 AI, 캘린더, 메일, 저장소, OCR, 회의 AI를 직접 개발하지 않는다.
외부 서비스는 Connector로 연결하고, PACEMAKER는 운영 판단과 실행 구조를 담당한다.

## Product Structure

```text
Product
├─ Experience
├─ Runtime
│  ├─ Engine → Protocol
│  └─ Operation
└─ Connector
```

## First Vertical Slice

1. 승인 사업계획서와 관련 자료 등록
2. AI 기반 문서 분석 및 구조 추출
3. 추천 Protocol 및 Draft Operation 생성
4. 전문가의 생애주기 전체 검토·추가·삭제·수정
5. Operation 확정 및 버전 생성
6. 할 일·일정·필요 문서·체크리스트 자동 도출

AI 결과는 추천안이며, 전문가가 확정하기 전에는 공식 Operation이 아니다.

## Legacy Preservation

기존 Growth Experience와 Alpha Runtime 코드는 삭제하지 않는다.
Foundation 2.0 전환이 완료될 때까지 Legacy 영역으로 보존하며,
새 Operation Runtime의 공식 소스로 사용하지 않는다.

Do Better.

Know Better.

Together Better.
