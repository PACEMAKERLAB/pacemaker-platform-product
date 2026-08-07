/** PACEMAKER Platform Product v2 - My Project Renderer - Version 1.1.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.MyProject = experience.MyProject || {};

    var TABS = [
        { id: "개요", label: "개요" },
        { id: "운영계획", label: "운영계획" },
        { id: "실행", label: "실행" },
        { id: "예산", label: "예산" },
        { id: "자료·문서", label: "자료·문서" },
        { id: "요청·승인", label: "요청·승인" },
        { id: "성과보고", label: "성과·보고" }
    ];

    function escapeHtml(value) {
        return String(value === undefined || value === null ? "" : value)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function money(value) {
        return new Intl.NumberFormat("ko-KR").format(Number(value) || 0) + "원";
    }

    function date(value) {
        if (!value) { return "확인 필요"; }
        return value.replace(/-/g, ". ") + ".";
    }

    function icon(name) {
        var paths = {
            home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
            folder: '<path d="M3 6.5h7l2 2h9v11H3z"/>',
            archive: '<path d="M4 7h16v13H4z"/><path d="M3 3h18v4H3z"/><path d="M9 12h6"/>',
            users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
            chevron: '<path d="m9 18 6-6-6-6"/>',
            more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
            check: '<path d="m5 12 4 4L19 6"/>',
            arrow: '<path d="m9 18 6-6-6-6"/>'
        };
        return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || paths.arrow) + '</svg>';
    }

    function badge(label, tone) {
        return '<span class="status-badge status-badge--' + tone + '">' + escapeHtml(label) + '</span>';
    }

    function renderSidebar() {
        return '<aside class="sidebar"><div class="brand"><div class="brand-mark">P</div><div><strong>PACEMAKER</strong><span>Operating OS</span></div></div>' +
            '<nav class="main-nav"><button class="nav-item">' + icon("home") + '<span>메인</span></button>' +
            '<button class="nav-item nav-item--parent is-active"><span class="nav-item-label">' + icon("folder") + '<span>내 사업</span></span><span class="nav-chevron is-open">' + icon("chevron") + '</span></button>' +
            '<div class="project-menu is-open"><button class="project-link is-active"><span class="project-dot"></span>함께머묾</button><button class="project-link"><span class="project-dot"></span>헬로우클래식</button></div>' +
            '<button class="nav-item">' + icon("users") + '<span>고객 관리</span><small class="expert-only">전문가</small></button>' +
            '<button class="nav-item">' + icon("archive") + '<span>아카이브</span></button></nav>' +
            '<div class="sidebar-profile"><div class="avatar">서</div><div><strong>서현</strong><span>운영 전문가</span></div></div></aside>';
    }

    function renderTabs(state) {
        return '<div class="workspace-tabs" role="tablist">' + TABS.map(function (tab) {
            return '<button role="tab" class="workspace-tab' + (state.activeTab === tab.id ? " is-active" : "") +
                '" data-tab="' + tab.id + '">' + tab.label + '</button>';
        }).join("") + '</div>';
    }

    function unitStatus(unit) {
        if (unit.evidenceMissingCount > 0) { return badge("자료 확인 필요", "danger"); }
        if (unit.completedCount > 0) { return badge("진행 중", "info"); }
        return badge("예정", "neutral");
    }

    function renderUnits(view) {
        return view.unitProjects.map(function (unit) {
            var tasks = [];
            if (unit.evidenceMissingCount > 0) {
                tasks.push({ title: "완료 회차 증빙 " + unit.evidenceMissingCount + "건 확인", state: "확인 필요", tone: "active" });
            }
            if (unit.planningRequiredCount > 0) {
                tasks.push({ title: "남은 " + unit.planningRequiredCount + "회 일정·실행계획 등록", state: "미착수", tone: "pending" });
            }
            tasks.push({ title: "회차별 준비자료와 담당자 확인", state: unit.scheduleCount ? "진행 중" : "미착수", tone: unit.scheduleCount ? "active" : "pending" });
            tasks.push({ title: "예산 항목 연결 확인", state: "진행 중", tone: "active" });

            return '<article class="overview-unit"><button class="overview-unit-head"><span><small>단위사업</small><strong>' +
                escapeHtml(unit.title) + '</strong><em>계획 ' + unit.plannedCount + '회 · 완료 ' + unit.completedCount + '회</em></span>' +
                unitStatus(unit) + icon("arrow") + '</button><div class="unit-current"><span>전체 진행률</span><strong>' +
                unit.progressRate + '% · 남은 실행 ' + unit.remainingCount + '회</strong></div><div class="unit-progress-line"><span style="width:' +
                unit.progressRate + '%"></span></div><div class="unit-operation-metrics"><span>일정 등록 <strong>' + unit.scheduleCount +
                '회</strong></span><span>계획 필요 <strong>' + unit.planningRequiredCount + '회</strong></span><span>증빙 누락 <strong>' +
                unit.evidenceMissingCount + '건</strong></span></div><ol class="unit-checklist">' + tasks.map(function (task) {
                    return '<li><span class="check-state check-state--' + task.tone + '">' + (task.tone === "complete" ? icon("check") : "") +
                        '</span><strong>' + escapeHtml(task.title) + '</strong><small>' + task.state + '</small></li>';
                }).join("") + '</ol></article>';
        }).join("");
    }

    function renderOverview(view, state) {
        var budget = view.budget[0] || { approvedAmount: 0, usedAmount: 0, remainingAmount: 0, usageRate: 0 };
        var process = view.process.steps.map(function (step, index) {
            var className = index < view.process.current ? " is-complete" : (index === view.process.current ? " is-current" : "");
            return '<div class="process-step' + className + '"><span class="process-node">' +
                (index < view.process.current ? icon("check") : index + 1) + '</span><strong>' + escapeHtml(step) + '</strong>' +
                (index === view.process.current ? '<small>현재 위치</small>' : '') + '</div>';
        }).join("");
        var completed = view.unitProjects.reduce(function (sum, unit) { return sum + unit.completedCount; }, 0);
        var planned = view.unitProjects.reduce(function (sum, unit) { return sum + unit.plannedCount; }, 0);

        return '<section class="slide-section"><div class="project-snapshot"><div class="snapshot-main"><span class="section-kicker">사업 개요</span>' +
            '<h2>' + escapeHtml(view.subtitle) + '</h2><p>' + escapeHtml(view.summary) + '</p>' +
            '<div class="snapshot-meta"><span>사업기간 <strong>' + date(view.period.startDate) + ' - ' + date(view.period.endDate) + '</strong></span><span>현재단계 <strong>' +
            escapeHtml(view.currentStageTitle) + '</strong></span><span>담당 <strong>' + escapeHtml(view.manager.name) + '</strong></span><span>운영기준 <strong>' +
            escapeHtml(view.versionSummary.currentVersion) + ' · 요구사항 ' + view.versionSummary.requirementCount + '개</strong></span></div></div>' +
            '<div class="budget-summary"><span>예산 집행현황</span><strong>' + budget.usageRate + '%</strong><dl>' +
            '<div><dt>승인예산</dt><dd>' + money(view.totals.approvedBudget) + '</dd></div><div><dt>사용예산</dt><dd>' +
            money(view.totals.usedBudget) + '</dd></div><div><dt>잔여예산</dt><dd>' + money(view.totals.approvedBudget - view.totals.usedBudget) +
            '</dd></div></dl><button class="budget-link" data-tab="예산">예산 상세 보기 →</button></div></div>' +
            '<div class="summary-strip operation-summary-strip"><div><span>전체 진행률</span><strong>' + view.totalProgressRate +
            '%</strong></div><div><span>단위사업</span><strong>' + view.unitProjects.length + '개</strong></div><div><span>전체 실행</span><strong>' +
            completed + '/' + planned + '회</strong></div><div><span>증빙 누락</span><strong>' + view.totals.evidenceMissing +
            '건</strong></div><div><span>계획 등록 필요</span><strong>' + view.totals.planningRequired + '회</strong></div></div>' +
            '<div class="overview-units-heading"><div><span class="section-kicker">단위사업 전체 현황</span><h2>계획과 해야 할 일</h2>' +
            '<p>완료·진행·미착수와 회차별 계획·증빙 상태를 함께 확인합니다.</p></div><div class="inline-actions"><button class="secondary-button">+ 계획 추가</button>' +
            '<button class="text-button" data-tab="운영계획">운영계획 상세</button></div></div><div class="overview-unit-grid">' + renderUnits(view) + '</div>' +
            '<div class="process-panel"><div class="process-heading"><div><span class="section-kicker">전체 프로세스</span><h2>현재 ‘' + escapeHtml(view.process.steps[view.process.current]) + '’ 단계입니다</h2></div>' +
            '<span>' + (view.process.current + 1) + ' / ' + view.process.steps.length + '</span></div><div class="process-track">' + process + '</div></div>' +
            '<div class="recent-change"><span>최근 변경</span><strong>' + escapeHtml(view.recentChange ? view.recentChange.title : "최근 변경이 없습니다.") +
            '</strong><button data-action="toggle-history">' + (view.history.length ? "전체 이력 " + view.history.length + "건" : "전체 이력") + '</button></div>' +
            (view.history.length ? '<div class="history-panel' + (state.showHistory ? " is-open" : "") + '">' + view.history.map(function (item) {
                return '<article><span>' + escapeHtml(item.operationVersion || "-") + '</span><div><strong>' + escapeHtml(item.title) +
                    '</strong><small>' + escapeHtml(item.changedAt) + ' · ' + escapeHtml(item.changedBy) + '</small></div></article>';
            }).join("") + '</div>' : '') + '</section>';
    }

    function occurrenceBadge(occurrence) {
        if (occurrence.status === "completed") { return badge("완료", "success"); }
        if (occurrence.status === "scheduled") { return badge("일정 등록", "info"); }
        return badge("계획 필요", "warning");
    }

    function renderPlan(plan) {
        var lifecycle = plan.lifecycle.map(function (stage) {
            return '<article class="plan-lifecycle-stage"><div><span>운영 단계</span><strong>' + escapeHtml(stage.title) +
                '</strong></div><ul>' + stage.tasks.map(function (task) {
                    return '<li><span class="check-state check-state--pending"></span><strong>' + escapeHtml(task.title) +
                        '</strong><small>Protocol 기본</small></li>';
                }).join("") + '</ul></article>';
        }).join("");
        var units = plan.unitProjects.map(function (unit) {
            var preparation = unit.preparationTasks.map(function (task) {
                return '<li><span class="check-state check-state--pending"></span><strong>' + escapeHtml(task.title) +
                    '</strong><small>회차마다 확인</small></li>';
            }).join("");
            var rounds = unit.occurrences.map(function (occurrence) {
                return '<button class="plan-round"><span><strong>' + occurrence.round + '회</strong><small>' +
                    (occurrence.scheduledDate || "일정 미등록") + '</small></span>' + occurrenceBadge(occurrence) +
                    '<em>준비 ' + occurrence.taskCount + ' · 문서 ' + occurrence.documentCount + '</em></button>';
            }).join("");

            return '<article class="plan-unit-card"><header><div><span>단위사업</span><h3>' + escapeHtml(unit.title) +
                '</h3><p>계획 ' + unit.plannedCount + '회 · 완료 ' + unit.completedCount + '회 · 일정 등록 ' + unit.scheduleCount +
                '회</p></div>' + (unit.planningRequiredCount ? badge("계획 필요 " + unit.planningRequiredCount + "회", "warning") : badge("계획 등록", "success")) +
                '</header><div class="plan-unit-body"><section><div class="plan-subheading"><strong>회차 공통 준비 체크리스트</strong>' +
                '<span>확정 Operation 기준</span></div><ol class="unit-checklist plan-checklist">' + preparation +
                '</ol></section><section><div class="plan-subheading"><strong>전체 회차</strong><span>클릭 시 실행계획 확인</span></div>' +
                '<div class="plan-round-grid">' + rounds + '</div></section></div></article>';
        }).join("");

        return '<section class="slide-section"><div class="section-heading"><div><span class="section-kicker">운영계획</span>' +
            '<h2>단위사업별 전체 운영 체크리스트</h2><p>전체 계획을 먼저 확인하고 현재 단계에서 필요한 항목만 홈의 할 일로 연결합니다.</p></div>' +
            '<div class="heading-actions"><span class="plan-source">' + escapeHtml(plan.dataNote) + '</span><button class="secondary-button">+ 계획 추가</button></div></div>' +
            '<div class="plan-summary-strip"><div><span>단위사업</span><strong>' + plan.summary.unitProjectCount + '개</strong></div>' +
            '<div><span>전체 회차</span><strong>' + plan.summary.completedOccurrenceCount + '/' + plan.summary.plannedOccurrenceCount + '회</strong></div>' +
            '<div><span>일정 등록</span><strong>' + plan.summary.scheduledOccurrenceCount + '회</strong></div><div><span>계획 필요</span><strong>' +
            plan.summary.planningRequiredCount + '회</strong></div><div><span>Protocol 요구사항</span><strong>' + plan.summary.requirementAssignmentCount +
            '개</strong></div><div><span>생애주기 기본 할 일</span><strong>' + plan.summary.lifecycleTaskCount +
            '개</strong></div></div><div class="plan-lifecycle"><div class="plan-subheading"><strong>사업 생애주기 기본 체크리스트</strong>' +
            '<span>전문가가 확정한 전체 운영기준</span></div><div class="plan-lifecycle-grid">' + lifecycle + '</div></div>' +
            '<div class="plan-unit-list">' + units + '</div></section>';
    }

    function executionStatus(status) {
        return {
            completed: badge("완료", "success"),
            preparing: badge("준비 중", "info"),
            action_required: badge("조치 필요", "danger"),
            planning_required: badge("일정 미등록", "warning")
        }[status];
    }

    function renderExecution(execution) {
        var cards = execution.activeSchedules.map(function (schedule) {
            var preparationRate = schedule.preparation.total
                ? Math.round((schedule.preparation.done / schedule.preparation.total) * 100)
                : 0;
            var missing = schedule.documents.missingTitles.slice(0, 3).map(function (title) {
                return '<li><span class="check-state check-state--pending"></span><strong>' + escapeHtml(title) +
                    '</strong><small>미첨부</small></li>';
            }).join("");

            return '<article class="execution-schedule-card"><button class="execution-schedule-head"><span class="execution-date"><strong>' +
                escapeHtml(schedule.scheduledDate ? schedule.scheduledDate.slice(8) : "-") + '</strong><small>' +
                escapeHtml(schedule.scheduledDate ? schedule.scheduledDate.slice(0, 7).replace("-", ".") : "일정 미정") +
                '</small></span><span><small>' + escapeHtml(schedule.unitProjectTitle) + '</small><strong>' + escapeHtml(schedule.title) +
                '</strong><em>준비 ' + schedule.preparation.done + '/' + schedule.preparation.total + ' · 문서 ' +
                schedule.documents.attached + '/' + schedule.documents.total + '</em></span>' + executionStatus(schedule.status) +
                icon("arrow") + '</button><div class="readiness-bar"><span style="width:' + preparationRate + '%"></span></div>' +
                '<ol class="schedule-check-preview">' + (missing || '<li><span class="check-state check-state--complete">' + icon("check") +
                '</span><strong>필요 문서 확인 완료</strong><small>충족</small></li>') + '</ol>' +
                '<button class="schedule-detail-button">전체 준비항목·서류 확인</button></article>';
        }).join("") || '<div class="empty-state"><div><strong>추진 중인 일정이 없습니다.</strong></div></div>';
        var ledgers = execution.units.map(function (unit) {
            return '<section class="execution-ledger-unit"><div class="execution-section-heading"><div><span class="section-kicker">단위사업</span>' +
                '<h2>' + escapeHtml(unit.title) + ' 전체 ' + unit.plannedCount + '회</h2></div><span>완료 ' + unit.completedCount +
                '회</span></div><div class="round-ledger">' + unit.rounds.map(function (round) {
                    return '<button class="round-item round-item--' + round.status + '"><span><strong>' + round.round + '회차</strong><small>' +
                        escapeHtml(round.scheduledDate || "일정 미정") + '</small></span>' + executionStatus(round.status) +
                        '<em>준비 ' + round.preparation.done + '/' + round.preparation.total + ' · 문서 ' + round.documents.attached + '/' +
                        round.documents.total + '</em></button>';
                }).join("") + '</div></section>';
        }).join("");

        return '<section class="slide-section"><div class="section-heading"><div><span class="section-kicker">실행 일정</span>' +
            '<h2>추진 중인 일정과 준비현황</h2><p>일정마다 준비업무·필요 문서·증빙을 확인하고 빠진 항목을 실행 전에 처리합니다.</p></div>' +
            '<div class="heading-actions"><span class="plan-source">' + escapeHtml(execution.asOfDate) + ' 기준</span><button class="secondary-button">+ 일정 추가</button></div></div>' +
            '<div class="execution-metrics"><div><span>전체 실행</span><strong>' + execution.summary.completedCount + '/' + execution.summary.plannedCount +
            '회</strong></div><div><span>준비 중</span><strong>' + execution.summary.preparingCount + '건</strong></div><div><span>조치 필요</span><strong>' +
            execution.summary.actionRequiredCount + '건</strong></div><div><span>일정 미등록</span><strong>' + execution.summary.planningRequiredCount +
            '회</strong></div></div><div class="execution-section-heading"><div><span class="section-kicker">가까운 일정·조치 필요</span><h2>지금 추진 중인 일정</h2></div>' +
            '<span>조치 필요 일정을 먼저 표시합니다.</span></div><div class="execution-schedule-grid">' + cards + '</div>' + ledgers + '</section>';
    }

    function documentBadge(document) {
        var label = { attached: "첨부 완료", missing: "누락", planned: "준비 예정" }[document.status];
        return '<span class="document-chip document-chip--' + document.status + '"><strong>' + escapeHtml(document.title) +
            '</strong><small>' + label + '</small></span>';
    }

    function renderDocuments(view, state) {
        var units = view.units.map(function (unit) {
            var rows = unit.occurrences.map(function (occurrence) {
                var status = occurrence.executionStatus === "completed" ? badge("완료", "success") :
                    occurrence.executionStatus === "scheduled" ? badge("일정 등록", "info") : badge("계획 필요", "warning");
                return '<article class="document-round"><div class="document-round-meta"><strong>' + occurrence.round + '회</strong><span>' +
                    escapeHtml(occurrence.scheduledDate || "일정 미등록") + '</span>' + status + '</div><div class="document-chip-list">' +
                    occurrence.documents.map(documentBadge).join("") + '</div><button class="document-map-button" data-action="upload-document">파일 첨부·매핑</button></article>';
            }).join("");
            return '<section class="document-unit"><header><div><span class="section-kicker">단위사업</span><h2>' + escapeHtml(unit.title) +
                '</h2><p>계획 ' + unit.plannedCount + '회 · 완료 ' + unit.completedCount + '회</p></div><div class="document-unit-summary"><span>필요 <strong>' +
                unit.summary.requiredCount + '</strong></span><span>첨부 <strong>' + unit.summary.attachedCount + '</strong></span><span>누락 <strong>' +
                unit.summary.missingCount + '</strong></span></div></header><div class="document-round-list">' + rows + '</div></section>';
        }).join("");
        return '<section class="slide-section"><div class="section-heading"><div><span class="section-kicker">자료·문서</span><h2>회차별 필요서류와 첨부 현황</h2>' +
            '<p>완료한 활동의 서명부·사진·지출 증빙을 회차별로 확인합니다.</p></div><div class="heading-actions"><span class="plan-source">Operation ' +
            escapeHtml(view.operationVersion) + ' 기준</span><button class="secondary-button" data-action="upload-document">+ 파일 업로드</button></div></div>' +
            '<div class="document-summary"><div><span>전체 회차</span><strong>' + view.summary.occurrenceCount + '회</strong></div><div><span>필요 문서</span><strong>' +
            view.summary.requiredCount + '건</strong></div><div><span>첨부 완료</span><strong>' + view.summary.attachedCount + '건</strong></div><div><span>완료 회차 누락</span><strong>' +
            view.summary.missingCount + '건</strong></div><div><span>준비 예정</span><strong>' + view.summary.plannedCount + '건</strong></div></div>' +
            '<div class="evidence-work-status"><div><span>지금 확인할 증빙 할 일</span><strong>' + state.evidenceWork.summary.todoCount + '건</strong></div>' +
            '<div><span>전문가 확인 대기</span><strong>' + state.evidenceWork.summary.reviewPendingCount + '건</strong></div><div><span>자동 완료</span><strong>' +
            state.evidenceWork.summary.autoCompletedCount + '건</strong></div><p>필수자료가 첨부되면 해당 문서 할 일을 자동 완료하고, 반려되면 다시 할 일로 복구합니다.</p></div>' +
            (state.documentNotice ? '<div class="document-notice">' + escapeHtml(state.documentNotice) + '</div>' : '') + units + '</section>';
    }

    function renderMappingModal(state) {
        var draft = state.mappingDraft;
        var view = state.documentView;
        var selectedUnit;
        if (!draft) { return ""; }
        selectedUnit = view.units.find(function (unit) { return unit.unitProjectId === draft.unitProjectId; }) || view.units[0];
        return '<div class="mapping-backdrop"><section class="mapping-dialog"><header><div><span class="section-kicker">자료 매핑 확인</span><h2>' +
            escapeHtml(draft.sourceAsset.fileName) + '</h2><p>자동 추천 결과를 확인하고 필요한 경우 수정해주세요.</p></div><button data-action="cancel-mapping">×</button></header>' +
            '<div class="mapping-confidence"><span>추천 신뢰도</span><strong>' + Math.round(draft.mapping.confidence * 100) + '%</strong><em>파일명 기반 추천</em></div>' +
            '<div class="mapping-fields"><label><span>단위사업</span><select data-mapping-field="unitProjectId">' + view.units.map(function (unit) {
                return '<option value="' + unit.unitProjectId + '"' + (unit.unitProjectId === draft.unitProjectId ? " selected" : "") + '>' + escapeHtml(unit.title) + '</option>';
            }).join("") + '</select></label><label><span>회차</span><select data-mapping-field="occurrenceId">' + selectedUnit.occurrences.map(function (occurrence) {
                return '<option value="' + occurrence.occurrenceId + '"' + (occurrence.occurrenceId === draft.occurrenceId ? " selected" : "") + '>' + occurrence.round + '회 · ' + escapeHtml(occurrence.scheduledDate || "일정 미등록") + '</option>';
            }).join("") + '</select></label><label><span>문서유형</span><select data-mapping-field="documentType">' + selectedUnit.occurrences[0].documents.map(function (document) {
                return '<option value="' + document.documentType + '"' + (document.documentType === draft.documentType ? " selected" : "") + '>' + escapeHtml(document.title) + '</option>';
            }).join("") + '</select></label></div><div class="mapping-trace"><span>사업</span><strong>함께머묾</strong><b>→</b><span>단위사업·회차</span><strong>' +
            escapeHtml(selectedUnit.title) + '</strong><b>→</b><span>자료 상태</span><strong>확인 후 첨부</strong></div><footer><button class="secondary-button" data-action="cancel-mapping">취소</button><button class="primary-button" data-action="confirm-mapping">매핑 확인·저장</button></footer></section></div>';
    }

    function approvalStatus(request) {
        return request.status === "approved" ? badge("승인", "success") : request.status === "rejected" ? badge("반려", "danger") : badge("확인 대기", "warning");
    }

    function renderApprovals(state) {
        var pending = state.approvalRequests.filter(function (item) { return item.status === "pending"; }).length;
        var cards = state.approvalRequests.map(function (request) {
            var typeLabel = request.type === "change_plan" ? "변경계획" : "증빙자료";
            return '<article class="approval-card"><header><div><span class="section-kicker">' + typeLabel + '</span><h2>' + escapeHtml(request.title) +
                '</h2><p>' + escapeHtml(request.description) + '</p></div>' + approvalStatus(request) + '</header><div class="approval-meta"><span>요청자 <strong>' +
                escapeHtml(request.requestedBy) + '</strong></span><span>요청일 <strong>' + escapeHtml(request.requestedAt.slice(0, 10)) + '</strong></span><span>처리기한 <strong>' +
                escapeHtml(request.dueDate || "-") + '</strong></span><span>기준 <strong>' + escapeHtml(request.operationVersion) + '</strong></span></div>' +
                (request.status === "pending" ? '<footer><button class="secondary-button" data-action="reject-request" data-request-id="' + request.approvalRequestId +
                '">반려·보완요청</button><button class="primary-button approval-primary" data-action="approve-request" data-request-id="' + request.approvalRequestId +
                '">승인</button></footer>' : '<footer class="approval-result"><strong>' + escapeHtml(request.reviewNote) + '</strong><span>' + escapeHtml(request.reviewedAt) +
                ' · ' + escapeHtml(request.reviewedBy) + '</span></footer>') + '</article>';
        }).join("");
        return '<section class="slide-section"><div class="section-heading"><div><span class="section-kicker">요청·승인</span><h2>운영 요청과 전문가 확인</h2>' +
            '<p>변경계획·제출문서·증빙자료를 확인하고 승인 또는 보완 요청합니다.</p></div><span class="plan-source">Operation V002 기준</span></div>' +
            '<div class="approval-summary"><div><span>전체 요청</span><strong>' + state.approvalRequests.length + '건</strong></div><div><span>확인 대기</span><strong>' + pending +
            '건</strong></div><div><span>승인</span><strong>' + state.approvalRequests.filter(function (item) { return item.status === "approved"; }).length +
            '건</strong></div><div><span>반려·보완</span><strong>' + state.approvalRequests.filter(function (item) { return item.status === "rejected"; }).length + '건</strong></div></div>' +
            (state.approvalNotice ? '<div class="document-notice">' + escapeHtml(state.approvalNotice) + '</div>' : '') + '<div class="approval-list">' + cards + '</div></section>';
    }

    function render(root, state) {
        var content = state.activeTab === "개요" ? renderOverview(state.view, state) :
            state.activeTab === "운영계획" ? renderPlan(state.planView) :
            state.activeTab === "실행" ? renderExecution(state.executionView) :
            state.activeTab === "자료·문서" ? renderDocuments(state.documentView, state) :
            state.activeTab === "요청·승인" ? renderApprovals(state) :
            '<section class="slide-section"><div class="panel"><div class="empty-state"><div><strong>' + escapeHtml(state.activeTab) +
            '</strong><p>다음 구현 단계에서 확정 Operation 데이터와 연결됩니다.</p></div></div></div></section>';
        root.innerHTML = '<div class="app-shell">' + renderSidebar() + '<header class="mobile-header"><div class="brand brand--mobile"><div class="brand-mark">P</div><strong>PACEMAKER</strong></div></header>' +
            '<main class="content content--workspace"><header class="workspace-header"><div><span class="breadcrumb">내 사업 / ' + escapeHtml(state.view.displayName) + '</span>' +
            '<div class="workspace-title"><h1>' + escapeHtml(state.view.displayName) + '</h1>' + badge(state.view.projectStatus, "success") + '</div><p>' + escapeHtml(state.view.subtitle) + ' · ' + date(state.view.period.startDate) + ' - ' + date(state.view.period.endDate) + '</p></div>' +
            '<div class="workspace-tools"><span><small>담당</small><strong>' + escapeHtml(state.view.manager.name) + '</strong></span><button class="expert-chat-button"><i></i><span>상담 가능</span><strong>전문가와 대화</strong></button>' +
            '<button class="icon-button">' + icon("more") + '</button></div></header>' + renderTabs(state) +
            '<div class="slide-shell"><button class="slide-arrow slide-arrow--left">' + icon("arrow") + '</button><div class="slide-content">' +
            content + '</div><button class="slide-arrow slide-arrow--right">' + icon("arrow") + '</button></div></main></div>' + renderMappingModal(state);
    }

    experience.MyProject.Renderer = Object.freeze({ render: render });
}(typeof globalThis !== "undefined" ? globalThis : this));
