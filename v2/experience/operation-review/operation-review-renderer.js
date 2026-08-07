/**
 * PACEMAKER Platform Product v2
 * Operation Review Renderer
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var experience = global.PacemakerV2.Experience;
    experience.OperationReview = experience.OperationReview || {};

    var SECTION_META = {
        lifecycle: { title: "사업 생애주기", description: "운영 단계와 단계별 기본 할 일을 확인합니다." },
        unitProjects: { title: "단위사업과 회차", description: "사업별 계획 횟수와 준비 기준을 확인합니다." },
        requiredDocuments: { title: "필요 문서와 증빙", description: "기관 제출서류와 회차별 증빙 기준을 확인합니다." },
        approvedBudget: { title: "승인예산", description: "항목별 승인금액과 집행 통제 기준을 확인합니다." }
    };

    function escapeHtml(value) {
        return String(value === undefined || value === null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatMoney(value) {
        return new Intl.NumberFormat("ko-KR").format(Number(value) || 0) + "원";
    }

    function getItems(operation, section) {
        if (section === "approvedBudget") {
            return operation.budget.approved;
        }

        return operation[section];
    }

    function getItemId(section, item) {
        return {
            lifecycle: item.stageId,
            unitProjects: item.unitProjectId,
            requiredDocuments: item.documentType,
            approvedBudget: item.categoryId
        }[section];
    }

    function itemMeta(section, item) {
        if (section === "lifecycle") {
            return "단계 " + item.order + " · 기본 할 일 " + (item.tasks || []).length + "개";
        }

        if (section === "unitProjects") {
            return "계획 " + item.plannedCount + "회 · 일정 등록 " + (item.occurrenceDates || []).length + "회";
        }

        if (section === "requiredDocuments") {
            return item.documentType;
        }

        return formatMoney(item.amount);
    }

    function renderSection(operation, section, index) {
        var meta = SECTION_META[section];
        var confirmed = operation.review.sectionConfirmations[section];
        var items = getItems(operation, section);
        var itemHtml = items.map(function (item) {
            var itemId = getItemId(section, item);

            return [
                '<article class="review-item">',
                '<div><div class="item-title">', escapeHtml(item.title), '</div>',
                '<div class="item-meta">', escapeHtml(itemMeta(section, item)), '</div></div>',
                '<div class="item-actions">',
                '<button class="button button-secondary" data-action="edit" data-section="', section,
                '" data-item-id="', escapeHtml(itemId), '">수정</button>',
                '<button class="button button-danger" data-action="remove" data-section="', section,
                '" data-item-id="', escapeHtml(itemId), '">삭제</button>',
                '</div></article>'
            ].join("");
        }).join("");

        return [
            '<section class="panel">',
            '<header class="panel-header"><h2 class="panel-title"><span class="step-number">', index + 1,
            '</span>', meta.title, '</h2><span class="', confirmed ? "confirmed-badge" : "pending-badge", '">',
            confirmed ? "확인 완료" : "확인 필요", '</span></header>',
            '<div class="item-list">', itemHtml || '<div class="review-item">등록된 항목이 없습니다.</div>', '</div>',
            '<footer class="panel-footer">',
            '<button class="button button-secondary" data-action="add" data-section="', section, '">+ 항목 추가</button>',
            '<button class="button button-confirm" data-action="confirm-section" data-section="', section, '" ',
            confirmed ? "disabled" : "", '>', confirmed ? "확인 완료" : "이 영역 확인 완료", '</button>',
            '</footer></section>'
        ].join("");
    }

    function renderReview(state) {
        var operation = state.session.operation;
        var sections = ["lifecycle", "unitProjects", "requiredDocuments", "approvedBudget"];
        var confirmedCount = sections.filter(function (section) {
            return operation.review.sectionConfirmations[section];
        }).length;
        var evidence = state.analysisResult.extractionEvidence.map(function (item) {
            return '<div class="evidence-item"><strong>' + escapeHtml(item.fieldPath) + '</strong><br>' +
                escapeHtml(item.excerpt) + '<br><span class="confidence">신뢰도 ' +
                Math.round(item.confidence * 100) + '%</span> · ' + escapeHtml(item.page) + '쪽</div>';
        }).join("");
        var history = state.session.historyEvents.slice(-5).reverse().map(function (item) {
            return '<div class="history-item"><strong>' + escapeHtml(item.eventType) + '</strong><br>' +
                escapeHtml(item.reason || item.toStatus || "") + '</div>';
        }).join("");

        return [
            '<div class="review-shell"><header class="topbar"><div class="brand">PACEMAKER</div>',
            '<div class="topbar-role">전문가 검토 화면</div></header><main class="review-main">',
            '<section class="review-header"><div><p class="eyebrow">AI 추천 Operation 검토</p>',
            '<h1>', escapeHtml(operation.title), '</h1>',
            '<p class="subtitle">AI가 사업계획서를 바탕으로 구성한 운영안입니다. 모든 영역을 확인한 뒤 확정해주세요.</p></div>',
            '<div class="status-box"><span class="status-label">현재 상태</span><strong class="status-value">검토 중</strong>',
            '<div class="progress-track"><div class="progress-bar" style="width:', confirmedCount * 25, '%"></div></div>',
            '<div class="item-meta">', confirmedCount, ' / 4 영역 확인</div></div></section>',
            '<div class="summary-grid">',
            '<div class="summary-card"><span>추천 Protocol</span><strong>', escapeHtml(operation.protocolRecommendation.protocolId), '</strong></div>',
            '<div class="summary-card"><span>추천 신뢰도</span><strong>', Math.round(operation.protocolRecommendation.confidence * 100), '%</strong></div>',
            '<div class="summary-card"><span>단위사업</span><strong>', operation.unitProjects.length, '개</strong></div>',
            '<div class="summary-card"><span>승인예산</span><strong>', formatMoney(operation.budget.approved.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0)), '</strong></div>',
            '</div>',
            state.error ? '<div class="error-message">' + escapeHtml(state.error) + '</div>' : '',
            '<div class="notice"><strong>확정 전 확인:</strong> AI 추천 내용은 공식 Operation이 아닙니다. 수정한 영역은 다시 확인해야 하며, 네 영역이 모두 확인되어야 V001을 생성할 수 있습니다.</div>',
            '<div class="review-grid"><div>',
            sections.map(function (section, index) { return renderSection(operation, section, index); }).join(""),
            '<div class="final-action"><div><strong>Operation 확정</strong><p>확정 후 할 일·일정·문서·체크리스트가 자동 생성됩니다.</p></div>',
            '<button class="button button-primary" data-action="confirm-operation" ', confirmedCount < 4 ? "disabled" : "", '>V001 확정하기</button></div>',
            '</div><aside class="side-panel">',
            '<section class="panel"><header class="panel-header"><h2 class="panel-title">원문 근거</h2></header><div class="side-content">', evidence, '</div></section>',
            '<section class="panel"><header class="panel-header"><h2 class="panel-title">최근 검토 이력</h2></header><div class="side-content">', history, '</div></section>',
            '</aside></div></main></div>'
        ].join("");
    }

    function renderCompleted(state) {
        var operation = state.session.operation;
        var result = state.derivedWork.summary;

        return [
            '<div class="review-shell"><header class="topbar"><div class="brand">PACEMAKER</div>',
            '<div class="topbar-role">전문가 검토 완료</div></header><main class="review-main">',
            '<section class="completion-panel"><p class="eyebrow">OPERATION CONFIRMED</p>',
            '<h1 class="completion-title">', escapeHtml(operation.title), ' ', escapeHtml(operation.currentVersion), ' 확정</h1>',
            '<p class="subtitle">전문가 검토 내용이 공식 Operation에 반영됐고 실행 항목이 생성됐습니다.</p>',
            '<div class="result-grid">',
            '<div class="result-card"><span>할 일</span><strong>', result.taskCount, '</strong></div>',
            '<div class="result-card"><span>일정</span><strong>', result.scheduleCount, '</strong></div>',
            '<div class="result-card"><span>체크리스트</span><strong>', result.checklistItemCount, '</strong></div>',
            '<div class="result-card"><span>필요 문서</span><strong>', result.documentRequirementCount, '</strong></div>',
            '<div class="result-card"><span>예산 항목</span><strong>', result.budgetCategoryCount, '</strong></div>',
            '<div class="result-card"><span>계획 등록 필요</span><strong>', result.planningRequiredCount, '</strong></div>',
            '</div></section></main></div>'
        ].join("");
    }

    function render(root, state) {
        root.innerHTML = state.completed ? renderCompleted(state) : renderReview(state);
    }

    experience.OperationReview.Renderer = Object.freeze({ render: render });
}(typeof globalThis !== "undefined" ? globalThis : this));
