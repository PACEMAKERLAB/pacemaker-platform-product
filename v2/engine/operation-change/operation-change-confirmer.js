/** PACEMAKER Platform Product v2 - Operation Change Confirmer - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.OperationChange = engine.OperationChange || {};

    function confirm(input) {
        var impact = input.changeImpact;
        var operation;
        if (!impact || impact.status !== "ready_for_confirmation") {
            throw new Error("Only a change impact ready for confirmation can be applied");
        }

        operation = global.PacemakerV2.Operation.Model.clone(input.currentOperation);
        operation.unitProjects = global.PacemakerV2.Operation.Model.clone(input.proposedAnalysisResult.unitProjects);
        operation.requirementAssignments = global.PacemakerV2.Operation.Model.clone(impact.proposedRequirementAssignments);
        operation.status = global.PacemakerV2.Operation.Schema.status.CHANGED;
        operation.change = {
            changeRequestId: input.changeRequestId,
            changeImpactId: impact.changeImpactId,
            changedAt: input.confirmedAt,
            changedBy: input.confirmedBy,
            reason: input.reason,
            beforeRequirementCount: impact.beforeRequirementCount,
            afterRequirementCount: impact.afterRequirementCount,
            removedRequirementAssignmentIds: impact.removedAssignments.map(function (item) {
                return item.requirementAssignmentId;
            })
        };
        operation.updatedAt = input.confirmedAt;
        operation.updatedBy = input.confirmedBy;
        return operation;
    }

    engine.OperationChange.ChangeConfirmer = Object.freeze({ confirm: confirm });
}(typeof globalThis !== "undefined" ? globalThis : this));
