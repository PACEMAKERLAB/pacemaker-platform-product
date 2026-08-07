/** PACEMAKER Platform Product v2 - Protocol Operation Merger - Version 1.0.0 */
(function (global) {
    "use strict";
    var generation = global.PacemakerV2.Engine.OperationGeneration;

    function occurrenceId(unitProjectId, round) {
        return unitProjectId + "-R" + String(round).padStart(3, "0");
    }

    function occurrenceProfile(unitProject, round) {
        var profile = (unitProject.occurrenceProfiles || []).find(function (item) {
            return Number(item.round) === round;
        });
        return profile || { round: round, deliveryMode: null, expenseTypes: [] };
    }

    function unitTypeMatches(rule, unitProject) {
        var types = rule.appliesTo.unitProjectTypes || [];
        return types.length === 0 || types.indexOf(unitProject.unitProjectType) !== -1;
    }

    function expenseMatches(rule, profile) {
        var configured = rule.appliesTo.expenseTypes || [];
        var actual = profile.expenseTypes || [];

        if (configured.length === 0 || configured.indexOf("all") !== -1) {
            return true;
        }

        return configured.some(function (type) { return actual.indexOf(type) !== -1; });
    }

    function conditionMatches(rule, profile) {
        if (rule.obligation !== "conditional") {
            return true;
        }

        if (!rule.condition) {
            return false;
        }

        if (rule.condition.field === "expense.type" && rule.condition.operator === "in") {
            return (rule.condition.values || []).some(function (value) {
                return (profile.expenseTypes || []).indexOf(value) !== -1;
            });
        }

        if (rule.condition.field === "deliveryMode" && rule.condition.operator === "in") {
            return (rule.condition.values || []).indexOf(profile.deliveryMode) !== -1;
        }

        return false;
    }

    function projectAssignment(rule, protocol) {
        return {
            requirementAssignmentId: "RQA-" + rule.requirementRuleId + "-PROJECT",
            requirementRuleId: rule.requirementRuleId,
            protocolId: protocol.protocolId,
            protocolVersion: protocol.protocolVersion,
            scope: "project",
            unitProjectId: null,
            occurrenceId: null,
            title: rule.title,
            obligation: rule.obligation,
            timing: rule.timing,
            document: rule.document,
            submission: rule.submission,
            completionCriteria: rule.completionCriteria,
            sourceEvidenceIds: rule.sourceEvidenceIds,
            status: "required"
        };
    }

    function occurrenceAssignment(rule, protocol, unitProject, round) {
        var occurrence = occurrenceId(unitProject.unitProjectId, round);
        return {
            requirementAssignmentId: "RQA-" + rule.requirementRuleId + "-" + occurrence,
            requirementRuleId: rule.requirementRuleId,
            protocolId: protocol.protocolId,
            protocolVersion: protocol.protocolVersion,
            scope: "occurrence",
            unitProjectId: unitProject.unitProjectId,
            occurrenceId: occurrence,
            title: rule.title,
            obligation: rule.obligation,
            timing: rule.timing,
            document: rule.document,
            submission: rule.submission,
            completionCriteria: rule.completionCriteria,
            sourceEvidenceIds: rule.sourceEvidenceIds,
            status: "required"
        };
    }

    function assignRequirements(protocol, analysisResult) {
        var assignments = [];

        protocol.requirementRules.forEach(function (rule) {
            if (rule.appliesTo.projectWide) {
                assignments.push(projectAssignment(rule, protocol));
                return;
            }

            analysisResult.unitProjects.forEach(function (unitProject) {
                var round;
                if (!unitTypeMatches(rule, unitProject)) {
                    return;
                }

                for (round = 1; round <= unitProject.plannedCount; round += 1) {
                    var profile = occurrenceProfile(unitProject, round);
                    if (expenseMatches(rule, profile) && conditionMatches(rule, profile)) {
                        assignments.push(occurrenceAssignment(rule, protocol, unitProject, round));
                    }
                }
            });
        });

        return assignments;
    }

    function assignExternalActions(protocol) {
        return protocol.externalActions.map(function (action) {
            return {
                externalActionAssignmentId: "EXA-" + action.externalActionId,
                protocolId: protocol.protocolId,
                protocolVersion: protocol.protocolVersion,
                service: action.service,
                action: action.action,
                menuCode: action.menuCode,
                stageCode: action.stageCode,
                status: "todo"
            };
        });
    }

    function merge(input) {
        var protocol = input.confirmedProtocol;
        var analysisResult = input.analysisResult;
        var recommendation = input.protocolRecommendation;
        var operation;

        if (!protocol || protocol.status !== "confirmed" || !protocol.protocolVersion) {
            throw new Error("Protocol Operation merge requires a confirmed Protocol Version");
        }

        if (recommendation.protocolId !== protocol.protocolId) {
            throw new Error("Protocol recommendation and confirmed Protocol must match");
        }

        operation = generation.DraftGenerator.generate({
            operationId: input.operationId,
            analysisResult: analysisResult,
            protocolRecommendation: recommendation,
            createdBy: input.createdBy,
            createdAt: input.createdAt
        });
        operation.protocolReference = {
            protocolId: protocol.protocolId,
            protocolVersion: protocol.protocolVersion
        };
        operation.requirementAssignments = assignRequirements(protocol, analysisResult);
        operation.externalActionAssignments = assignExternalActions(protocol);

        return operation;
    }

    generation.ProtocolOperationMerger = Object.freeze({
        merge: merge,
        assignRequirements: assignRequirements
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
