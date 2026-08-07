/** PACEMAKER Platform Product v2 - Operation Change Review Renderer - Version 1.0.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.OperationChangeReview = experience.OperationChangeReview || {};
    function escapeHtml(value) { return String(value || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    function assignmentList(items, emptyText, tone) {
        if (!items.length) { return '<div class="empty">' + emptyText + '</div>'; }
        return items.map(function (item) {
            return '<article class="impact-item ' + tone + '"><div><strong>' + escapeHtml(item.title) +
                '</strong><span>' + escapeHtml(item.occurrenceId || "사업 전체") + ' · ' + escapeHtml(item.timing) +
                '</span></div><b>' + (tone === "remove" ? "삭제 예정" : tone === "protect" ? "보호" : "유지") + '</b></article>';
        }).join("");
    }
    function render(root, state) {
        var impact = state.impact;
        var change = impact.requestedChange;
        if (state.completed) {
            root.innerHTML = '<header class="topbar"><b>PACEMAKER</b><span>전문가 변경 검토 완료</span></header><main class="wrap">' +
                '<section class="complete"><p class="eyebrow">OPERATION CHANGED</p><h1>변경 내용이 Operation에 반영되었습니다.</h1>' +
                '<p>소식지 계획이 3회에서 2회로 변경됐고, 영향분석 결과와 확정자가 History에 기록되었습니다.</p>' +
                '<div class="summary"><div><span>현재 버전</span><strong>' + escapeHtml(state.operation.currentVersion) + '</strong></div>' +
                '<div><span>이전 버전 보존</span><strong>' + escapeHtml(state.previousVersions[0].version) + '</strong></div>' +
                '<div><span>요구사항</span><strong>' + impact.afterRequirementCount + '개</strong></div><div><span>History</span><strong>' + state.historyEvents.length + '건</strong></div></div></section></main>';
            return;
        }
        root.innerHTML = '<header class="topbar"><b>PACEMAKER</b><span>전문가 변경 검토</span></header><main class="wrap">' +
            '<section class="hero"><div><p class="eyebrow">OPERATION CHANGE IMPACT</p><h1>운영계획 변경 영향 확인</h1>' +
            '<p>변경을 확정하기 전에 없어지는 규칙과 보호해야 할 실행 기록을 확인해주세요.</p></div><div class="status"><span>판정 상태</span><strong>확정 가능</strong></div></section>' +
            '<section class="change-card"><div><span>단위사업</span><strong>' + escapeHtml(change.title) + '</strong></div>' +
            '<div class="count old"><span>변경 전</span><strong>' + change.before + '회</strong></div><div class="arrow">→</div>' +
            '<div class="count new"><span>변경 후</span><strong>' + change.after + '회</strong></div><div class="reason"><span>변경 사유</span><strong>여름호 대체 사업 추진</strong></div></section>' +
            '<section class="summary"><div><span>요구사항 변경</span><strong>' + impact.beforeRequirementCount + ' → ' + impact.afterRequirementCount + '</strong></div>' +
            '<div><span>삭제 예정</span><strong>' + impact.removedAssignments.length + '개</strong></div><div><span>새로 추가</span><strong>' + impact.addedAssignments.length + '개</strong></div>' +
            '<div><span>보호 항목</span><strong>' + impact.protectedAssignments.length + '개</strong></div></section>' +
            (state.error ? '<div class="message">' + escapeHtml(state.error) + '</div>' : '') +
            '<div class="grid"><section class="panel"><header><h2>삭제되는 요구사항</h2><em>확정 시 반영</em></header>' +
            assignmentList(impact.removedAssignments, "삭제되는 항목이 없습니다.", "remove") + '</section>' +
            '<section class="panel"><header><h2>보호되는 실행 기록</h2><em>자동 삭제 금지</em></header>' +
            assignmentList(impact.protectedAssignments, "완료·증빙으로 보호할 항목이 없습니다.", "protect") + '</section></div>' +
            '<section class="panel retained"><header><h2>유지되는 핵심 기준</h2><em>Protocol V001</em></header>' +
            '<div class="keep-grid"><div><span>외부 강사 적용</span><strong>8회 유지</strong></div><div><span>자체 소통활동</span><strong>4회 유지</strong></div>' +
            '<div><span>외부 시스템 처리</span><strong>보탬e 2개 유지</strong></div></div></section>' +
            '<footer class="actions"><div><strong>전문가 확인 후에만 반영됩니다.</strong><p>확정 전에는 현재 Operation과 실행 기록이 변경되지 않습니다.</p></div>' +
            '<button class="secondary" data-action="back">수정안으로 돌아가기</button><button class="primary" data-action="confirm">변경 확정</button></footer></main>';
    }
    experience.OperationChangeReview.Renderer = Object.freeze({ render: render });
}(typeof globalThis !== "undefined" ? globalThis : this));
