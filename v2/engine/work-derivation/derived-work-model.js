/**
 * PACEMAKER Platform Product v2
 * Derived Work Model
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var engine = global.PacemakerV2.Engine;
    engine.WorkDerivation = engine.WorkDerivation || {};

    function create(input) {
        return {
            derivedWorkId: input.derivedWorkId,
            operationId: input.operationId,
            operationVersion: input.operationVersion,
            asOfDate: input.asOfDate,
            tasks: input.tasks || [],
            schedules: input.schedules || [],
            checklistItems: input.checklistItems || [],
            documentRequirements: input.documentRequirements || [],
            budgetControls: input.budgetControls || [],
            alerts: input.alerts || [],
            summary: input.summary || {}
        };
    }

    engine.WorkDerivation.Model = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
