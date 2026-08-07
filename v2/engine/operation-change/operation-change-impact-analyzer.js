/** PACEMAKER Platform Product v2 - Operation Change Impact Analyzer - Version 1.0.0 */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.OperationChange = engine.OperationChange || {};

    function indexById(items) {
        return (items || []).reduce(function (index, item) {
            index[item.requirementAssignmentId] = item;
            return index;
        }, {});
    }

    function completedOccurrenceIds(executionState) {
        var ids = {};
        var completed = (executionState && executionState.completedOccurrences) || {};
        Object.keys(completed).forEach(function (unitProjectId) {
            var round;
            for (round = 1; round <= Number(completed[unitProjectId] || 0); round += 1) {
                ids[unitProjectId + "-R" + String(round).padStart(3, "0")] = true;
            }
        });
        return ids;
    }

    function hasRegisteredDocument(occurrenceId, executionState) {
        var documentStatus = (executionState && executionState.documentStatus) || {};
        return Object.keys(documentStatus).some(function (key) {
            return key.indexOf(occurrenceId + ":") === 0 && documentStatus[key] !== "missing";
        });
    }

    function analyze(input) {
        var operation = input.currentOperation;
        var proposedAnalysis = input.proposedAnalysisResult;
        var protocol = input.confirmedProtocol;
        var current;
        var proposedAssignments;
        var proposed;
        var protectedIds = completedOccurrenceIds(input.executionState);
        var retained = [];
        var added = [];
        var removed = [];
        var protectedItems = [];

        if (!operation || !operation.protocolReference) {
            throw new Error("Change impact analysis requires an Operation with Protocol reference");
        }
        if (!protocol || protocol.status !== "confirmed") {
            throw new Error("Change impact analysis requires a confirmed Protocol");
        }
        if (operation.protocolReference.protocolId !== protocol.protocolId ||
                operation.protocolReference.protocolVersion !== protocol.protocolVersion) {
            throw new Error("Operation and confirmed Protocol Version must match");
        }

        current = indexById(operation.requirementAssignments);
        proposedAssignments = global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger
            .assignRequirements(protocol, proposedAnalysis);
        proposed = indexById(proposedAssignments);

        Object.keys(current).forEach(function (id) {
            var item = current[id];
            if (proposed[id]) {
                retained.push(item);
            } else if (item.occurrenceId &&
                    (protectedIds[item.occurrenceId] || hasRegisteredDocument(item.occurrenceId, input.executionState))) {
                protectedItems.push(Object.assign({}, item, {
                    impactStatus: "protected",
                    protectionReason: protectedIds[item.occurrenceId]
                        ? "completed_occurrence"
                        : "registered_document"
                }));
            } else {
                removed.push(Object.assign({}, item, { impactStatus: "remove" }));
            }
        });

        Object.keys(proposed).forEach(function (id) {
            if (!current[id]) {
                added.push(Object.assign({}, proposed[id], { impactStatus: "add" }));
            }
        });

        return {
            changeImpactId: input.changeImpactId,
            operationId: operation.operationId,
            status: protectedItems.length ? "manual_review_required" : "ready_for_confirmation",
            requestedChange: input.requestedChange,
            protocolReference: operation.protocolReference,
            beforeRequirementCount: operation.requirementAssignments.length,
            afterRequirementCount: retained.length + added.length + protectedItems.length,
            retainedAssignments: retained,
            addedAssignments: added,
            removedAssignments: removed,
            protectedAssignments: protectedItems,
            proposedRequirementAssignments: proposedAssignments,
            analyzedAt: input.analyzedAt,
            analyzedBy: input.analyzedBy
        };
    }

    engine.OperationChange.ImpactAnalyzer = Object.freeze({ analyze: analyze });
}(typeof globalThis !== "undefined" ? globalThis : this));
