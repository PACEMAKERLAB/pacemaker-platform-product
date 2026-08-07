/**
 * PACEMAKER Platform Product v2
 * Operation Overview Projector
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.OperationProjection = engine.OperationProjection || {};

    function occurrenceNumber(occurrenceId) {
        return Number(String(occurrenceId).split("-R")[1]) || 0;
    }

    function documentStatusKey(requirement) {
        return requirement.occurrenceId + ":" + requirement.documentType;
    }

    function buildUnitProjects(operation, derivedWork, executionState) {
        return operation.unitProjects.map(function (unitProject) {
            var completed = Number(executionState.completedOccurrences[unitProject.unitProjectId]) || 0;
            var schedules = derivedWork.schedules.filter(function (schedule) {
                return schedule.unitProjectId === unitProject.unitProjectId;
            });
            var planningRequired = derivedWork.alerts.filter(function (alert) {
                return alert.unitProjectId === unitProject.unitProjectId &&
                    occurrenceNumber(alert.occurrenceId) > completed;
            }).length;
            var completedRequirements = derivedWork.documentRequirements.filter(function (requirement) {
                return requirement.unitProjectId === unitProject.unitProjectId &&
                    occurrenceNumber(requirement.occurrenceId) <= completed;
            });
            var attached = completedRequirements.filter(function (requirement) {
                return executionState.documentStatus[documentStatusKey(requirement)] === "attached";
            }).length;

            return {
                unitProjectId: unitProject.unitProjectId,
                title: unitProject.title,
                plannedCount: unitProject.plannedCount,
                completedCount: completed,
                remainingCount: Math.max(unitProject.plannedCount - completed, 0),
                progressRate: unitProject.plannedCount
                    ? Math.round((completed / unitProject.plannedCount) * 100)
                    : 0,
                scheduleCount: schedules.length,
                planningRequiredCount: planningRequired,
                evidenceAttachedCount: attached,
                evidenceRequiredCount: completedRequirements.length,
                evidenceMissingCount: completedRequirements.length - attached
            };
        });
    }

    function buildBudget(operation, executionState) {
        return operation.budget.approved.map(function (category) {
            var used = executionState.usedBudget.find(function (item) {
                return item.categoryId === category.categoryId;
            });
            var usedAmount = used ? Number(used.amount) : 0;
            var approvedAmount = Number(category.amount) || 0;

            return {
                categoryId: category.categoryId,
                title: category.title,
                approvedAmount: approvedAmount,
                usedAmount: usedAmount,
                remainingAmount: approvedAmount - usedAmount,
                usageRate: approvedAmount ? Math.round((usedAmount / approvedAmount) * 100) : 0,
                source: used ? used.source : "expense_resolutions"
            };
        });
    }

    function buildPriorityItems(unitProjects, derivedWork, executionState) {
        var items = [];

        (executionState.operatorRequests || []).forEach(function (request) {
            items.push({
                priorityItemId: request.requestId,
                type: "operator_request",
                title: request.title,
                meta: "운영자 요청 · " + request.dueDate,
                priority: request.priority
            });
        });

        unitProjects.forEach(function (unitProject) {
            if (unitProject.evidenceMissingCount > 0) {
                items.push({
                    priorityItemId: "EVIDENCE-" + unitProject.unitProjectId,
                    type: "evidence_missing",
                    title: unitProject.title + " 완료 회차의 증빙 " + unitProject.evidenceMissingCount + "건이 누락되었습니다.",
                    meta: "자료·문서에서 회차별 첨부 상태를 확인하세요.",
                    priority: "high"
                });
            }

            if (unitProject.planningRequiredCount > 0) {
                items.push({
                    priorityItemId: "PLAN-" + unitProject.unitProjectId,
                    type: "planning_required",
                    title: unitProject.title + " 미등록 실행계획 " + unitProject.planningRequiredCount + "회",
                    meta: "일정 또는 실행계획을 등록하고, 변경 시 변경계획서를 첨부하세요.",
                    priority: "normal"
                });
            }
        });

        return items.slice(0, 5);
    }

    function project(operation, derivedWork, executionState) {
        var unitProjects = buildUnitProjects(operation, derivedWork, executionState);
        var budget = buildBudget(operation, executionState);
        var totalPlanned = unitProjects.reduce(function (sum, item) { return sum + item.plannedCount; }, 0);
        var totalCompleted = unitProjects.reduce(function (sum, item) { return sum + item.completedCount; }, 0);
        var currentStageIndex = operation.lifecycle.findIndex(function (stage) {
            return stage.stageId === executionState.currentStageId;
        });
        var processSteps = [
            "기준 확인",
            "계획·교부",
            "착수 준비",
            "운영",
            "점검·증빙",
            "종료",
            "실적·정산",
            "성과보고"
        ];

        return {
            operationId: operation.operationId,
            operationVersion: operation.currentVersion,
            title: operation.title,
            asOfDate: executionState.asOfDate,
            currentStageId: executionState.currentStageId,
            currentStageTitle: currentStageIndex >= 0 ? operation.lifecycle[currentStageIndex].title : "확인 필요",
            process: {
                steps: processSteps,
                current: executionState.currentStageId === "STG-02" ? 3 : Math.max(currentStageIndex, 0)
            },
            lifecycle: operation.lifecycle.map(function (stage, index) {
                return {
                    stageId: stage.stageId,
                    title: stage.title,
                    state: index < currentStageIndex ? "completed" : index === currentStageIndex ? "current" : "upcoming"
                };
            }),
            totalProgressRate: totalPlanned ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
            unitProjects: unitProjects,
            priorityItems: buildPriorityItems(unitProjects, derivedWork, executionState),
            upcomingSchedules: derivedWork.schedules
                .filter(function (schedule) { return schedule.scheduledDate >= executionState.asOfDate; })
                .sort(function (a, b) { return a.scheduledDate.localeCompare(b.scheduledDate); })
                .slice(0, 5),
            budget: budget,
            totals: {
                approvedBudget: budget.reduce(function (sum, item) { return sum + item.approvedAmount; }, 0),
                usedBudget: budget.reduce(function (sum, item) { return sum + item.usedAmount; }, 0),
                evidenceMissing: unitProjects.reduce(function (sum, item) { return sum + item.evidenceMissingCount; }, 0),
                planningRequired: unitProjects.reduce(function (sum, item) { return sum + item.planningRequiredCount; }, 0)
            }
        };
    }

    engine.OperationProjection.OverviewProjector = Object.freeze({ project: project });
}(typeof globalThis !== "undefined" ? globalThis : this));
