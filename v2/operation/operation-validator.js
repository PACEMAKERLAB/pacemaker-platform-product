/**
 * PACEMAKER Platform Product v2
 * Operation Validator
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    function validate(operation) {
        var errors = [];

        if (!operation || typeof operation !== "object") {
            return { valid: false, errors: ["operation must be an object"] };
        }

        namespace.Schema.requiredFields.forEach(function (field) {
            if (!Object.prototype.hasOwnProperty.call(operation, field)) {
                errors.push(field + " is required");
            }
        });

        if (!operation.operationId) {
            errors.push("operationId must not be empty");
        }

        if (!operation.projectId) {
            errors.push("projectId must not be empty");
        }

        if (!operation.title) {
            errors.push("title must not be empty");
        }

        if (Object.values(namespace.Schema.status).indexOf(operation.status) === -1) {
            errors.push("status is invalid");
        }

        if (!Array.isArray(operation.lifecycle)) {
            errors.push("lifecycle must be an array");
        }

        if (!Array.isArray(operation.unitProjects)) {
            errors.push("unitProjects must be an array");
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    function assertValid(operation) {
        var result = validate(operation);

        if (!result.valid) {
            throw new Error("Invalid Operation: " + result.errors.join(", "));
        }

        return operation;
    }

    namespace.Validator = Object.freeze({
        validate: validate,
        assertValid: assertValid
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
