/** PACEMAKER Platform Product v2 - Operation Plan Projector - Version 1.0.0 */
(function (global) {
    "use strict";
    var projection = global.PacemakerV2.Engine.OperationProjection;

    function occurrenceNumber(occurrenceId) {
        return Number(String(occurrenceId).split("-R")[1]) || 0;
    }

    function project(operation, derivedWork, executionState) {
        var units = operation.unitProjects.map(function (unit) {
            var completedCount = Number(executionState.completedOccurrences[unit.unitProjectId]) || 0;
            var occurrences = [];
            var round;

            for (round = 1; round <= unit.plannedCount; round += 1) {
                var occurrenceId = unit.unitProjectId + "-R" + String(round).padStart(3, "0");
                var schedule = derivedWork.schedules.find(function (item) {
                    return item.occurrenceId === occurrenceId;
                });
                var documentCount = derivedWork.documentRequirements.filter(function (item) {
                    return item.occurrenceId === occurrenceId;
                }).length;
                var taskCount = derivedWork.tasks.filter(function (item) {
                    return item.occurrenceId === occurrenceId;
                }).length;

                occurrences.push({
                    occurrenceId: occurrenceId,
                    round: round,
                    status: round <= completedCount ? "completed" : schedule ? "scheduled" : "planning_required",
                    scheduledDate: schedule ? schedule.scheduledDate : null,
                    taskCount: taskCount,
                    documentCount: documentCount
                });
            }

            return {
                unitProjectId: unit.unitProjectId,
                title: unit.title,
                plannedCount: unit.plannedCount,
                completedCount: completedCount,
                preparationTasks: unit.preparationTasks || [],
                requiredDocumentTypes: unit.requiredDocumentTypes || [],
                occurrences: occurrences,
                scheduleCount: occurrences.filter(function (item) { return item.scheduledDate; }).length,
                planningRequiredCount: occurrences.filter(function (item) { return item.status === "planning_required"; }).length,
                source: "confirmed_operation"
            };
        });

        return {
            operationId: operation.operationId,
            operationVersion: operation.currentVersion,
            lifecycle: operation.lifecycle.map(function (stage) {
                return {
                    stageId: stage.stageId,
                    title: stage.title,
                    tasks: stage.tasks || []
                };
            }),
            unitProjects: units,
            summary: {
                unitProjectCount: units.length,
                plannedOccurrenceCount: units.reduce(function (sum, unit) { return sum + unit.plannedCount; }, 0),
                completedOccurrenceCount: units.reduce(function (sum, unit) { return sum + unit.completedCount; }, 0),
                scheduledOccurrenceCount: units.reduce(function (sum, unit) { return sum + unit.scheduleCount; }, 0),
                planningRequiredCount: units.reduce(function (sum, unit) { return sum + unit.planningRequiredCount; }, 0),
                lifecycleTaskCount: operation.lifecycle.reduce(function (sum, stage) { return sum + (stage.tasks || []).length; }, 0),
                requirementAssignmentCount: (operation.requirementAssignments || []).length
            },
            dataNote: "확정 Operation " + operation.currentVersion + " 기준"
        };
    }

    projection.PlanProjector = Object.freeze({ project: project, occurrenceNumber: occurrenceNumber });
}(typeof globalThis !== "undefined" ? globalThis : this));
