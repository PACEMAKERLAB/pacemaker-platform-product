/**
 * PACEMAKER Platform Product v2
 * Operation State Machine Test
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    function expectError(callback, message) {
        var failed = false;

        try {
            callback();
        } catch (error) {
            failed = true;
        }

        assert(failed, message);
    }

    function run() {
        var operation = global.PacemakerV2.Operation.Model.create({
            operationId: "OPR-2026-0001",
            projectId: "PRJ-2026-0001",
            title: "함께머묾 마을공동체",
            createdBy: "USR-EXPERT-0001",
            now: "2026-08-07T09:00:00.000Z"
        });
        var result;
        var version;

        assert(operation.status === "draft", "new operation must be draft");
        assert(global.PacemakerV2.Operation.Validator.validate(operation).valid, "draft must be valid");

        result = global.PacemakerV2.Operation.StateMachine.transition(operation, {
            toStatus: "in_review",
            actorId: "USR-EXPERT-0001",
            historyEventId: "HST-2026-0001",
            at: "2026-08-07T09:10:00.000Z"
        });
        operation = result.operation;
        assert(operation.status === "in_review", "draft must enter review");

        result = global.PacemakerV2.Operation.StateMachine.transition(operation, {
            toStatus: "confirmed",
            actorId: "USR-EXPERT-0001",
            historyEventId: "HST-2026-0002",
            at: "2026-08-07T09:20:00.000Z"
        });
        operation = result.operation;
        version = global.PacemakerV2.Operation.VersionManager.createSnapshot(operation, {
            confirmedBy: "USR-EXPERT-0001",
            confirmedAt: "2026-08-07T09:20:00.000Z"
        });
        operation = global.PacemakerV2.Operation.Model.clone(version.snapshot);

        assert(operation.status === "confirmed", "review must be confirmed");
        assert(operation.currentVersion === "V001", "first confirmation must create V001");

        result = global.PacemakerV2.Operation.StateMachine.transition(operation, {
            toStatus: "changed",
            actorId: "USR-EXPERT-0001",
            changeRequestId: "CHG-2026-0001",
            historyEventId: "HST-2026-0003",
            reason: "여름호를 교육 사업으로 대체",
            at: "2026-08-07T09:30:00.000Z"
        });
        operation = result.operation;
        assert(operation.status === "changed", "confirmed operation must accept approved change work");
        assert(operation.currentVersion === "V001", "change work must not increment version before reconfirmation");

        expectError(function () {
            global.PacemakerV2.Operation.StateMachine.transition(operation, {
                toStatus: "confirmed",
                actorId: "USR-EXPERT-0001"
            });
        }, "changed operation must pass review before reconfirmation");

        return {
            passed: true,
            operationId: operation.operationId,
            status: operation.status,
            version: operation.currentVersion
        };
    }

    global.PacemakerV2OperationStateMachineTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
