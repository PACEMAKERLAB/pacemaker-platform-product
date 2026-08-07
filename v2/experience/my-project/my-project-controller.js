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
        var budgetState = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
        var initialBudgetView = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
        executionState.usedBudget = [{ categoryId: "BGT-001", amount: initialBudgetView.summary.usedTotal, source: "approved_expense_resolutions" }];
        var derivedWork = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: executionState.asOfDate });
        var evidenceWork = global.PacemakerV2.Runtime.EvidenceWork.execute({
            derivedWork: derivedWork, executionState: executionState, reconciledAt: new Date().toISOString()
        });
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
            expenseEvidenceReview: null,
            botameSubmissionPackages: {},
            botameStorageDownloads: {},
            storageConnector: global.PacemakerV2.Connector.Storage.BrowserDemoAdapter.create(),
            budgetNotice: null,
            budgetView: initialBudgetView
        };

        function refreshPerformance() {
            state.performanceView = global.PacemakerV2.Engine.OperationProjection.PerformanceReportProjector.project({
                operation: operation, overviewView: state.view, documentView: state.documentView,
                budgetView: state.budgetView, asOfDate: executionState.asOfDate
            });
        }

        refreshPerformance();

        function refreshBudgetAndOverview() {
            state.budgetView = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
            executionState.usedBudget = [{ categoryId: "BGT-001", amount: state.budgetView.summary.usedTotal, source: "approved_expense_resolutions" }];
            state.view = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(operation, derivedWork, executionState, versionState);
            refreshPerformance();
        }

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

        root.addEventListener("click", async function (event) {
            var tab = event.target.closest("button[data-tab]");
            var action = event.target.closest("button[data-action]");
            if (tab) { state.activeTab = tab.dataset.tab; }
            if (action && action.dataset.action === "change-budget-view") { state.budgetMode = action.dataset.budgetView; }
            if (action && action.dataset.action === "open-expense-resolution") {
                state.budgetDraft = { unitProjectId: budgetState.unitProjects[0].unitProjectId, occurrenceNumber: "1", categoryId: budgetState.categories[0].categoryId, amount: "", status: "expert_review_pending", evidenceAttached: false };
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
                    refreshBudgetAndOverview();
                    state.budgetNotice = (expense.status === "approved" ? "승인된" : "확인 대기") + " 지출결의서를 등록했습니다.";
                    state.budgetDraft = null;
                } catch (error) { state.budgetNotice = error.message; }
            }
            if (action && action.dataset.action === "open-evidence-review") {
                var reviewExpense = budgetState.expenseResolutions.find(function (item) { return item.expenseResolutionId === action.dataset.expenseId; });
                state.expenseEvidenceReview = { expenseResolutionId: reviewExpense.expenseResolutionId, reviewedAssetIds: [], inspection: global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(reviewExpense, []) };
            }
            if (action && action.dataset.action === "mark-evidence-reviewed" && state.expenseEvidenceReview) {
                if (state.expenseEvidenceReview.reviewedAssetIds.indexOf(action.dataset.assetId) < 0) { state.expenseEvidenceReview.reviewedAssetIds.push(action.dataset.assetId); }
                var markedExpense = budgetState.expenseResolutions.find(function (item) { return item.expenseResolutionId === state.expenseEvidenceReview.expenseResolutionId; });
                state.expenseEvidenceReview.inspection = global.PacemakerV2.Runtime.ExpenseResolutionReview.inspect(markedExpense, state.expenseEvidenceReview.reviewedAssetIds);
            }
            if (action && action.dataset.action === "cancel-evidence-review") { state.expenseEvidenceReview = null; }
            if (action && (action.dataset.action === "confirm-evidence-review" || action.dataset.action === "reject-expense-resolution")) {
                var reviewExpenseId = action.dataset.action === "confirm-evidence-review" ? state.expenseEvidenceReview.expenseResolutionId : action.dataset.expenseId;
                var expenseIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.expenseResolutionId === reviewExpenseId; });
                var expenseDecision = action.dataset.action === "confirm-evidence-review" ? "approved" : "rejected";
                var reviewedExpense = global.PacemakerV2.Runtime.ExpenseResolutionReview.review({
                    expenseResolution: budgetState.expenseResolutions[expenseIndex], decision: expenseDecision,
                    executionState: executionState,
                    evidenceReview: state.expenseEvidenceReview && state.expenseEvidenceReview.inspection,
                    reviewedAt: new Date().toISOString(), reviewedBy: "USR-EXPERT-0001",
                    reviewNote: expenseDecision === "approved" ? "집행내역 확인 완료" : "증빙자료 보완 후 다시 요청해주세요.",
                    historyEventId: "HST-EXPENSE-" + Date.now()
                });
                budgetState.expenseResolutions[expenseIndex] = reviewedExpense.expenseResolution;
                executionState = reviewedExpense.executionState;
                versionState.historyEvents = versionState.historyEvents.concat([reviewedExpense.historyEvent]);
                if (expenseDecision === "approved") {
                    var reviewedUnit = budgetState.unitProjects.find(function (item) { return item.unitProjectId === reviewedExpense.expenseResolution.unitProjectId; }) || {};
                    var reviewedCategory = budgetState.categories.find(function (item) { return item.categoryId === reviewedExpense.expenseResolution.categoryId; }) || {};
                    var packageResult = global.PacemakerV2.Runtime.BotameSubmission.generate({
                        submissionPackageId: "BSP-" + Date.now(),
                        expenseResolution: reviewedExpense.expenseResolution,
                        operationVersion: operation.currentVersion,
                        projectTitle: operation.projectProfile.displayName || operation.title,
                        unitProjectTitle: reviewedUnit.title,
                        categoryTitle: reviewedCategory.title,
                        generatedAt: new Date().toISOString(),
                        generatedBy: "USR-EXPERT-0001",
                        historyEventId: "HST-BOTAME-PACKAGE-" + Date.now()
                    });
                    state.botameSubmissionPackages[reviewedExpense.expenseResolution.expenseResolutionId] = packageResult.submissionPackage;
                    versionState.historyEvents = versionState.historyEvents.concat([packageResult.historyEvent]);
                }
                state.evidenceWork = global.PacemakerV2.Runtime.EvidenceWork.execute({ derivedWork: derivedWork, executionState: executionState, previousResult: state.evidenceWork, reconciledAt: new Date().toISOString() });
                state.documentView = global.PacemakerV2.Engine.OperationProjection.DocumentProjector.project(operation, derivedWork, executionState);
                state.executionView = global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(operation, derivedWork, executionState);
                refreshBudgetAndOverview();
                state.expenseEvidenceReview = null;
                state.budgetNotice = expenseDecision === "approved" ? "자료 검토를 완료했습니다. 보탬e 등록용 제출자료를 생성했습니다." : "자료 보완을 요청했습니다. 보완 할 일이 다시 생성됩니다.";
            }
            if (action && action.dataset.action === "download-botame-manifest") {
                var downloadPackage = state.botameSubmissionPackages[action.dataset.expenseId];
                if (downloadPackage) {
                    var manifestPayload = {
                        submissionPackageId: downloadPackage.submissionPackageId,
                        expenseResolutionId: downloadPackage.expenseResolutionId,
                        operationVersion: downloadPackage.operationVersion,
                        status: downloadPackage.status,
                        manifest: downloadPackage.manifest,
                        files: downloadPackage.files,
                        generatedAt: downloadPackage.generatedAt,
                        generatedBy: downloadPackage.generatedBy,
                        note: "실제 원본 파일 묶음은 Storage Connector 연결 후 생성됩니다."
                    };
                    var manifestBlob = new Blob([JSON.stringify(manifestPayload, null, 2)], { type: "application/json;charset=utf-8" });
                    var manifestUrl = URL.createObjectURL(manifestBlob);
                    var manifestLink = document.createElement("a");
                    manifestLink.href = manifestUrl;
                    manifestLink.download = downloadPackage.downloadFileName.replace(/\.zip$/i, "_목록.json");
                    manifestLink.click();
                    URL.revokeObjectURL(manifestUrl);
                    state.budgetNotice = "보탬e 제출자료 목록을 다운로드했습니다. 실제 파일 묶음은 Storage Connector 연결 후 제공됩니다.";
                }
            }
            if (action && action.dataset.action === "prepare-botame-storage-download") {
                var storagePackage = state.botameSubmissionPackages[action.dataset.expenseId];
                if (storagePackage) {
                    try {
                        var storageDownload = await global.PacemakerV2.Runtime.BotameSubmissionDownload.prepare({
                            submissionPackage: storagePackage,
                            storageConnector: state.storageConnector,
                            requestedAt: new Date().toISOString(),
                            requestedBy: "USR-CUSTOMER-0001",
                            expiresAt: new Date(Date.now() + 86400000).toISOString(),
                            historyEventId: "HST-BOTAME-ARCHIVE-" + Date.now()
                        });
                        state.botameStorageDownloads[action.dataset.expenseId] = storageDownload;
                        versionState.historyEvents = versionState.historyEvents.concat([storageDownload.historyEvent]);
                        state.budgetNotice = "Demo Storage Connector가 원본 조회·묶음 생성·다운로드 링크 발급을 완료했습니다.";
                    } catch (error) { state.budgetNotice = error.message; }
                }
            }
            if (action && action.dataset.action === "complete-botame-processing") {
                var readyIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.expenseResolutionId === action.dataset.expenseId; });
                var completedBotame = global.PacemakerV2.Runtime.BotameCompletion.complete({ expenseResolution: budgetState.expenseResolutions[readyIndex], executionState: executionState, completedAt: new Date().toISOString(), completedBy: "USR-CUSTOMER-0001", historyEventId: "HST-BOTAME-" + Date.now() });
                budgetState.expenseResolutions[readyIndex] = completedBotame.expenseResolution;
                executionState = completedBotame.executionState;
                versionState.historyEvents = versionState.historyEvents.concat([completedBotame.historyEvent]);
                refreshBudgetAndOverview();
                state.budgetNotice = "보탬e 처리 완료로 표시했습니다. 사용예산과 증빙 완료 상태에 반영했습니다.";
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
                refreshPerformance();
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
                refreshPerformance();
                state.approvalNotice = result.request.title + " 요청을 " + (decision === "approved" ? "승인했습니다." : "반려했습니다. 관련 할 일이 다시 생성됩니다.");
            }
            if (!tab && !action) { return; }
            experience.MyProject.Renderer.render(root, state);
        });

        experience.MyProject.Renderer.render(root, state);
    }

    experience.MyProject.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
