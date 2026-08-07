/** PACEMAKER Platform Product v2 - My Project Controller - Version 1.0.0 */
(function (global) {
    "use strict";
    var experience = global.PacemakerV2.Experience;
    experience.MyProject = experience.MyProject || {};

    function start(options) {
        var root = document.getElementById(options.rootId);
        var versionState = global.PacemakerV2CommunityOperationV2Fixture.build("USR-EXPERT-0001");
        var operation = versionState.operation;
        var executionState = global.PacemakerV2.Operation.Model.clone(global.PacemakerV2CommunityExecutionStateFixture);
        executionState.documentReviewStatus = executionState.documentReviewStatus || {};
        executionState.documentStatus["UNT-002-R006:photo"] = "attached";
        executionState.documentReviewStatus["UNT-002-R006:photo"] = "pending";
        var derivedWork = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: executionState.asOfDate });
        var evidenceWork = global.PacemakerV2.Runtime.EvidenceWork.execute({
            derivedWork: derivedWork, executionState: executionState, reconciledAt: new Date().toISOString()
        });
        var budgetState = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
        var state = {
            activeTab: "개요",
            showHistory: false,
            view: global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(
                operation, derivedWork, executionState, versionState
            ),
            planView: global.PacemakerV2.Engine.OperationProjection.PlanProjector.project(
                operation, derivedWork, executionState
            ),
            executionView: global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(
                operation, derivedWork, executionState
            ),
            documentView: global.PacemakerV2.Engine.OperationProjection.DocumentProjector.project(
                operation, derivedWork, executionState
            ),
            documentNotice: null,
            mappingDraft: null,
            evidenceWork: evidenceWork
            ,approvalRequests: global.PacemakerV2CommunityApprovalRequestsFixture.map(function (item) {
                return global.PacemakerV2.Product.Approval.RequestModel.create(item);
            }),
            approvalNotice: null,
            budgetMode: "unit",
            budgetState: budgetState,
            budgetDraft: null,
            budgetNotice: null,
            budgetView: global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState })
        };

        root.addEventListener("change", function (event) {
            if (state.budgetDraft && event.target.dataset.budgetField) {
                state.budgetDraft[event.target.dataset.budgetField] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
                if (event.target.dataset.budgetField === "unitProjectId") { state.budgetDraft.occurrenceNumber = "1"; }
                experience.MyProject.Renderer.render(root, state);
                return;
            }
            if (!state.mappingDraft || !event.target.dataset.mappingField) { return; }
            state.mappingDraft[event.target.dataset.mappingField] = event.target.value;
            if (event.target.dataset.mappingField === "unitProjectId") {
                state.mappingDraft.occurrenceId = event.target.value + "-R001";
                var selectedUnit = operation.unitProjects.find(function (item) { return item.unitProjectId === event.target.value; });
                state.mappingDraft.documentType = selectedUnit.requiredDocumentTypes[0];
            }
            experience.MyProject.Renderer.render(root, state);
        });

        root.addEventListener("click", function (event) {
            var tab = event.target.closest("button[data-tab]");
            var action = event.target.closest("button[data-action]");
            if (tab) { state.activeTab = tab.dataset.tab; }
            if (action && action.dataset.action === "change-budget-view") { state.budgetMode = action.dataset.budgetView; }
            if (action && action.dataset.action === "open-expense-resolution") {
                state.budgetDraft = { unitProjectId: budgetState.unitProjects[0].unitProjectId, occurrenceNumber: "1", categoryId: budgetState.categories[0].categoryId, amount: "", status: "pending", evidenceAttached: false };
                state.budgetNotice = null;
            }
            if (action && action.dataset.action === "cancel-expense-resolution") { state.budgetDraft = null; }
            if (action && action.dataset.action === "save-expense-resolution" && state.budgetDraft) {
                try {
                    var expense = global.PacemakerV2.Product.Budget.ExpenseResolutionModel.create({
                        expenseResolutionId: "EXP-" + Date.now(), unitProjectId: state.budgetDraft.unitProjectId,
                        occurrenceId: state.budgetDraft.unitProjectId + "-R" + String(state.budgetDraft.occurrenceNumber).padStart(3, "0"),
                        categoryId: state.budgetDraft.categoryId, amount: state.budgetDraft.amount, status: state.budgetDraft.status,
                        evidenceAttached: state.budgetDraft.evidenceAttached, registeredAt: new Date().toISOString(), registeredBy: "USR-EXPERT-0001"
                    });
                    budgetState.expenseResolutions.push(expense);
                    state.budgetView = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
                    state.budgetNotice = (expense.status === "approved" ? "승인된" : "확인 대기") + " 지출결의서를 등록했습니다.";
                    state.budgetDraft = null;
                } catch (error) { state.budgetNotice = error.message; }
            }
            if (action && (action.dataset.action === "approve-expense-resolution" || action.dataset.action === "reject-expense-resolution")) {
                var expenseIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.expenseResolutionId === action.dataset.expenseId; });
                var expenseDecision = action.dataset.action === "approve-expense-resolution" ? "approved" : "rejected";
                var reviewedExpense = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({
                    expenseResolution: budgetState.expenseResolutions[expenseIndex], decision: expenseDecision,
                    reviewedAt: new Date().toISOString(), reviewedBy: "USR-EXPERT-0001",
                    reviewNote: expenseDecision === "approved" ? "집행내역 확인 완료" : "증빙자료 보완 후 다시 요청해주세요.",
                    historyEventId: "HST-EXPENSE-" + Date.now()
                });
                budgetState.expenseResolutions[expenseIndex] = reviewedExpense.expenseResolution;
                state.budgetView = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
                state.budgetNotice = "지출결의서를 " + (expenseDecision === "approved" ? "승인하여 사용예산에 반영했습니다." : "반려했습니다. 보완 할 일이 다시 생성됩니다.");
            }
            if (action && action.dataset.action === "toggle-history") {
                state.showHistory = !state.showHistory;
            }
            if (action && action.dataset.action === "upload-document") {
                var input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.onchange = function () {
                    var file = input.files[0];
                    var now = new Date().toISOString();
                    var suggested = global.PacemakerV2.Runtime.AssetMapping.suggest({
                        assetMappingId: "AMP-" + Date.now(),
                        sourceAsset: {
                            sourceAssetId: "AST-UPLOAD-" + Date.now(), projectId: operation.projectId,
                            assetType: "other", fileName: file.name, mimeType: file.type,
                            storageReference: "browser-session://" + encodeURIComponent(file.name),
                            authority: "evidence", uploadedBy: "USR-EXPERT-0001", now: now
                        },
                        operation: operation
                    });
                    var suggestedOccurrence = suggested.mapping.occurrenceId || "";
                    state.mappingDraft = {
                        sourceAsset: suggested.sourceAsset, mapping: suggested.mapping,
                        unitProjectId: suggested.mapping.unitProjectId || operation.unitProjects[0].unitProjectId,
                        occurrenceId: suggestedOccurrence || operation.unitProjects[0].unitProjectId + "-R001",
                        documentType: suggested.mapping.documentType || operation.unitProjects[0].requiredDocumentTypes[0]
                    };
                    state.documentNotice = input.files.length + "개 파일을 선택했습니다. 매핑을 확인한 뒤 저장해주세요.";
                    experience.MyProject.Renderer.render(root, state);
                };
                input.click();
            }
            if (action && action.dataset.action === "cancel-mapping") {
                state.mappingDraft = null;
            }
            if (action && action.dataset.action === "confirm-mapping" && state.mappingDraft) {
                var mapped = global.PacemakerV2.Runtime.AssetMapping.confirm({
                    sourceAsset: state.mappingDraft.sourceAsset, mapping: state.mappingDraft.mapping,
                    unitProjectId: state.mappingDraft.unitProjectId, occurrenceId: state.mappingDraft.occurrenceId,
                    documentType: state.mappingDraft.documentType, executionState: executionState,
                    confirmedAt: new Date().toISOString(), confirmedBy: "USR-EXPERT-0001",
                    historyEventId: "HST-ASSET-" + Date.now()
                });
                executionState = mapped.executionState;
                versionState.historyEvents = versionState.historyEvents.concat([mapped.historyEvent]);
                var nextEvidenceWork = global.PacemakerV2.Runtime.EvidenceWork.execute({
                    derivedWork: derivedWork, executionState: executionState,
                    previousResult: state.evidenceWork, reconciledAt: new Date().toISOString()
                });
                state.evidenceWork = nextEvidenceWork;
                state.documentView = global.PacemakerV2.Engine.OperationProjection.DocumentProjector.project(
                    operation, derivedWork, executionState
                );
                state.view = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(
                    operation, derivedWork, executionState, versionState
                );
                state.executionView = global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(
                    operation, derivedWork, executionState
                );
                state.documentNotice = mapped.sourceAsset.fileName + " 파일을 " + mapped.assetMapping.occurrenceId + "에 매핑했습니다. " +
                    (nextEvidenceWork.summary.autoCompletedCount ? "관련 할 일 " + nextEvidenceWork.summary.autoCompletedCount + "건이 자동 완료됐습니다." : "관련 할 일 상태를 다시 확인했습니다.");
                state.mappingDraft = null;
            }
            if (action && (action.dataset.action === "approve-request" || action.dataset.action === "reject-request")) {
                var requestIndex = state.approvalRequests.findIndex(function (item) { return item.approvalRequestId === action.dataset.requestId; });
                var decision = action.dataset.action === "approve-request" ? "approved" : "rejected";
                var result = global.PacemakerV2.Runtime.Approval.review({
                    request: state.approvalRequests[requestIndex], decision: decision,
                    executionState: executionState, reviewedBy: "USR-EXPERT-0001",
                    reviewedAt: new Date().toISOString(), reviewNote: decision === "rejected" ? "자료 보완 후 다시 요청해주세요." : "확인 완료",
                    historyEventId: "HST-APPROVAL-" + Date.now()
                });
                state.approvalRequests[requestIndex] = result.request;
                executionState = result.executionState;
                versionState.historyEvents = versionState.historyEvents.concat([result.historyEvent]);
                state.evidenceWork = global.PacemakerV2.Runtime.EvidenceWork.execute({ derivedWork: derivedWork, executionState: executionState, previousResult: state.evidenceWork, reconciledAt: new Date().toISOString() });
                state.view = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(operation, derivedWork, executionState, versionState);
                state.documentView = global.PacemakerV2.Engine.OperationProjection.DocumentProjector.project(operation, derivedWork, executionState);
                state.executionView = global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(operation, derivedWork, executionState);
                state.approvalNotice = result.request.title + " 요청을 " + (decision === "approved" ? "승인했습니다." : "반려했습니다. 관련 할 일이 다시 생성됩니다.");
            }
            if (!tab && !action) { return; }
            experience.MyProject.Renderer.render(root, state);
        });

        experience.MyProject.Renderer.render(root, state);
    }

    experience.MyProject.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
