/**
 * PACEMAKER Platform Product v2
 * Operation Review Controller
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var experience = global.PacemakerV2.Experience;
    experience.OperationReview = experience.OperationReview || {};

    function createInitialState(expertId) {
        var fixture = global.PacemakerV2CommunityOperationDraftFixture;
        var analysisResult = global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(
            fixture.analysisResult
        );
        var recommendation = global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(
            fixture.protocolRecommendation
        );
        var draft = global.PacemakerV2.Engine.OperationGeneration.DraftGenerator.generate({
            operationId: "OPR-2026-0001",
            analysisResult: analysisResult,
            protocolRecommendation: recommendation,
            createdBy: expertId,
            createdAt: "2026-08-07T13:00:00.000Z"
        });
        draft.requiredDocuments = draft.requiredDocuments.map(function (document) {
            return Object.assign({}, document, { required: true, purpose: "운영·예산 증빙", botameSubmission: true, unitProjectId: "all", occurrenceScope: "all", categoryId: "all", templateAssetId: null, source: "ai_recommended" });
        });

        return {
            expertId: expertId,
            analysisResult: analysisResult,
            session: global.PacemakerV2.Runtime.OperationReview.open(draft, {
                expertId: expertId,
                at: new Date().toISOString()
            }),
            completed: false,
            derivedWork: null,
            error: null
        };
    }

    function nextId(section, operation) {
        var count = section === "approvedBudget"
            ? operation.budget.approved.length
            : operation[section].length;
        var prefix = {
            lifecycle: "STG",
            unitProjects: "UNT",
            requiredDocuments: "custom-document",
            approvedBudget: "BGT"
        }[section];

        return prefix + "-" + String(count + 1).padStart(3, "0");
    }

    function createItem(section, operation) {
        var title = global.prompt("추가할 항목명을 입력해주세요.");
        var id;

        if (!title) {
            return null;
        }

        id = nextId(section, operation);

        if (section === "lifecycle") {
            return { stageId: id, title: title, order: operation.lifecycle.length + 1, tasks: [] };
        }

        if (section === "unitProjects") {
            return { unitProjectId: id, title: title, plannedCount: 1, occurrenceDates: [], preparationTasks: [], requiredDocumentTypes: [] };
        }

        if (section === "requiredDocuments") {
            return { documentType: id, title: title, required: global.confirm("필수 문서로 지정할까요?"), purpose: global.prompt("문서 용도를 입력해주세요.", "예산 집행·보탬e 제출") || "운영 증빙", botameSubmission: global.confirm("보탬e 제출자료에 포함할까요?"), unitProjectId: global.prompt("적용 단위사업 ID를 입력해주세요. 전체 적용은 all", "all") || "all", occurrenceScope: global.prompt("적용 회차를 입력해주세요. 전체 적용은 all", "all") || "all", categoryId: global.prompt("적용 예산항목 ID를 입력해주세요. 전체 적용은 all", "all") || "all", templateAssetId: null, source: "expert_added" };
        }

        return { categoryId: id, title: title, amount: Number(global.prompt("승인금액을 입력해주세요.", "0")) || 0 };
    }

    function findItem(section, itemId, operation) {
        var items = section === "approvedBudget" ? operation.budget.approved : operation[section];
        var idField = global.PacemakerV2.Operation.ReviewPolicy.editableCollection[section].idField;

        return items.find(function (item) { return item[idField] === itemId; });
    }

    function updateChanges(section, item) {
        var title = global.prompt("항목명을 수정해주세요.", item.title);
        var changes;

        if (!title) {
            return null;
        }

        changes = { title: title };

        if (section === "unitProjects") {
            changes.plannedCount = Number(global.prompt("계획 회차를 입력해주세요.", item.plannedCount)) || item.plannedCount;
        }

        if (section === "approvedBudget") {
            changes.amount = Number(global.prompt("승인금액을 입력해주세요.", item.amount)) || 0;
        }

        if (section === "requiredDocuments") {
            changes.required = global.confirm("필수 증빙으로 지정할까요?");
            changes.purpose = global.prompt("문서 용도", item.purpose || "운영 증빙") || "운영 증빙";
            changes.botameSubmission = global.confirm("보탬e 제출자료에 포함할까요?");
            changes.unitProjectId = global.prompt("적용 단위사업 ID", item.unitProjectId || "all") || "all";
            changes.occurrenceScope = global.prompt("적용 회차", item.occurrenceScope || "all") || "all";
            changes.categoryId = global.prompt("적용 예산항목 ID", item.categoryId || "all") || "all";
        }

        return changes;
    }

    function start(options) {
        var root = document.getElementById(options.rootId);
        var state = createInitialState(options.expertId);
        var runtime = global.PacemakerV2.Runtime.OperationReview;

        function render() {
            experience.OperationReview.Renderer.render(root, state);
        }

        function execute(callback) {
            try {
                state.error = null;
                callback();
            } catch (error) {
                state.error = error.message;
            }

            render();
        }

        root.addEventListener("click", function (event) {
            var button = event.target.closest("button[data-action]");
            var action;
            var section;
            var itemId;

            if (!button) {
                return;
            }

            action = button.dataset.action;
            section = button.dataset.section;
            itemId = button.dataset.itemId;

            if (action === "add") {
                execute(function () {
                    var item = createItem(section, state.session.operation);

                    if (item) {
                        state.session = runtime.edit(state.session, {
                            section: section,
                            action: "add",
                            item: item,
                            expertId: state.expertId,
                            at: new Date().toISOString()
                        });
                    }
                });
            }

            if (action === "edit") {
                execute(function () {
                    var item = findItem(section, itemId, state.session.operation);
                    var changes = updateChanges(section, item);

                    if (changes) {
                        state.session = runtime.edit(state.session, {
                            section: section,
                            action: "update",
                            itemId: itemId,
                            changes: changes,
                            expertId: state.expertId,
                            at: new Date().toISOString()
                        });
                    }
                });
            }

            if (action === "remove" && global.confirm("이 항목을 삭제할까요?")) {
                execute(function () {
                    state.session = runtime.edit(state.session, {
                        section: section,
                        action: "remove",
                        itemId: itemId,
                        expertId: state.expertId,
                        at: new Date().toISOString()
                    });
                });
            }

            if (action === "confirm-section") {
                execute(function () {
                    state.session = runtime.confirmSection(state.session, {
                        section: section,
                        expertId: state.expertId,
                        at: new Date().toISOString()
                    });
                });
            }

            if (action === "confirm-operation") {
                execute(function () {
                    state.session = runtime.confirm(state.session, {
                        expertId: state.expertId,
                        at: new Date().toISOString()
                    });
                    state.derivedWork = global.PacemakerV2.Runtime.DerivedWork.execute(
                        state.session.operation,
                        { asOfDate: new Date().toISOString().slice(0, 10) }
                    );
                    state.completed = true;
                });
            }
        });

        render();
    }

    experience.OperationReview.Controller = Object.freeze({ start: start });
}(typeof globalThis !== "undefined" ? globalThis : this));
