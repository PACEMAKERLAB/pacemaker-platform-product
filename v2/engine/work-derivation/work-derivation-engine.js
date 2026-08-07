/**
 * PACEMAKER Platform Product v2
 * Work Derivation Engine
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.WorkDerivation = engine.WorkDerivation || {};

    function normalize(value) {
        return String(value || "").replace(/[^A-Za-z0-9-]/g, "-");
    }

    function createId(prefix, parts) {
        return prefix + "-" + parts.map(normalize).join("-");
    }

    function documentMap(operation) {
        var map = {};

        operation.requiredDocuments.forEach(function (document) {
            map[document.documentType] = document;
        });

        return map;
    }

    function deriveLifecycleTasks(operation, output) {
        operation.lifecycle.forEach(function (stage) {
            (stage.tasks || []).forEach(function (task, index) {
                output.tasks.push({
                    taskId: createId("TSK", [operation.operationId, operation.currentVersion, stage.stageId, task.taskId || index + 1]),
                    sourceType: "lifecycle",
                    sourceId: stage.stageId,
                    title: task.title,
                    stageId: stage.stageId,
                    status: "todo"
                });
            });
        });
    }

    function deriveUnitProjectWork(operation, output, documents) {
        operation.unitProjects.forEach(function (unitProject) {
            var plannedCount = Number(unitProject.plannedCount) || 0;
            var dates = unitProject.occurrenceDates || [];
            var preparationTasks = unitProject.preparationTasks || [];
            var requiredDocumentTypes = unitProject.requiredDocumentTypes || [];
            var round;

            for (round = 1; round <= plannedCount; round += 1) {
                var occurrenceId = unitProject.unitProjectId + "-R" + String(round).padStart(3, "0");
                var scheduledDate = dates[round - 1] || null;

                if (scheduledDate) {
                    output.schedules.push({
                        scheduleId: createId("SCH", [operation.operationId, operation.currentVersion, occurrenceId]),
                        unitProjectId: unitProject.unitProjectId,
                        occurrenceId: occurrenceId,
                        title: unitProject.title + " " + round + "회",
                        scheduledDate: scheduledDate,
                        status: "scheduled"
                    });
                } else {
                    output.alerts.push({
                        alertId: createId("ALT", [operation.operationId, operation.currentVersion, occurrenceId, "PLAN"]),
                        alertType: "planning_required",
                        unitProjectId: unitProject.unitProjectId,
                        occurrenceId: occurrenceId,
                        message: unitProject.title + " " + round + "회 일정 또는 실행계획을 등록해야 합니다. 계획 변경 시 변경계획서를 등록하세요."
                    });
                }

                preparationTasks.forEach(function (task, taskIndex) {
                    var taskId = createId("TSK", [operation.operationId, operation.currentVersion, occurrenceId, task.taskCode || taskIndex + 1]);

                    output.tasks.push({
                        taskId: taskId,
                        sourceType: "unit_project_occurrence",
                        sourceId: occurrenceId,
                        unitProjectId: unitProject.unitProjectId,
                        occurrenceId: occurrenceId,
                        title: unitProject.title + " " + round + "회 · " + task.title,
                        dueDate: scheduledDate,
                        status: "todo"
                    });

                    output.checklistItems.push({
                        checklistItemId: createId("CHK", [taskId]),
                        occurrenceId: occurrenceId,
                        checkType: "preparation_task",
                        referenceId: taskId,
                        title: task.title,
                        checked: false
                    });
                });

                requiredDocumentTypes.forEach(function (documentType) {
                    var document = documents[documentType];
                    var requirementId = createId("DOC", [operation.operationId, operation.currentVersion, occurrenceId, documentType]);

                    output.documentRequirements.push({
                        documentRequirementId: requirementId,
                        unitProjectId: unitProject.unitProjectId,
                        occurrenceId: occurrenceId,
                        documentType: documentType,
                        title: document ? document.title : documentType,
                        status: "missing",
                        attachmentIds: []
                    });

                    output.checklistItems.push({
                        checklistItemId: createId("CHK", [requirementId]),
                        occurrenceId: occurrenceId,
                        checkType: "required_document",
                        referenceId: requirementId,
                        title: document ? document.title : documentType,
                        checked: false
                    });
                });
            }
        });
    }

    function deriveBudgetControls(operation, output) {
        (operation.budget.approved || []).forEach(function (category) {
            output.budgetControls.push({
                budgetControlId: createId("BGC", [operation.operationId, operation.currentVersion, category.categoryId]),
                categoryId: category.categoryId,
                title: category.title,
                approvedAmount: Number(category.amount) || 0,
                usedAmount: 0,
                remainingAmount: Number(category.amount) || 0,
                usageRate: 0
            });
        });
    }

    function derive(operation, input) {
        var asOfDate = input.asOfDate;
        var output;

        if (operation.status !== global.PacemakerV2.Operation.Schema.status.CONFIRMED) {
            throw new Error("DerivedWork requires a confirmed Operation");
        }

        if (!operation.currentVersion) {
            throw new Error("DerivedWork requires an Operation Version");
        }

        if (!asOfDate) {
            throw new Error("DerivedWork requires asOfDate for deterministic output");
        }

        output = {
            tasks: [],
            schedules: [],
            checklistItems: [],
            documentRequirements: [],
            budgetControls: [],
            alerts: []
        };

        deriveLifecycleTasks(operation, output);
        deriveUnitProjectWork(operation, output, documentMap(operation));
        deriveBudgetControls(operation, output);

        return engine.WorkDerivation.Model.create({
            derivedWorkId: createId("DRV", [operation.operationId, operation.currentVersion, asOfDate]),
            operationId: operation.operationId,
            operationVersion: operation.currentVersion,
            asOfDate: asOfDate,
            tasks: output.tasks,
            schedules: output.schedules,
            checklistItems: output.checklistItems,
            documentRequirements: output.documentRequirements,
            budgetControls: output.budgetControls,
            alerts: output.alerts,
            summary: {
                taskCount: output.tasks.length,
                scheduleCount: output.schedules.length,
                checklistItemCount: output.checklistItems.length,
                documentRequirementCount: output.documentRequirements.length,
                budgetCategoryCount: output.budgetControls.length,
                planningRequiredCount: output.alerts.length
            }
        });
    }

    engine.WorkDerivation.Engine = Object.freeze({ derive: derive });
}(typeof globalThis !== "undefined" ? globalThis : this));
