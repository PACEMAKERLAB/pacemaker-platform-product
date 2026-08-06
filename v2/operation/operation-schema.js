/**
 * PACEMAKER Platform Product v2
 * Operation Schema
 * Version 1.0.0
 */
(function (global) {
    "use strict";

    var namespace = global.PacemakerV2.Operation;

    var STATUS = Object.freeze({
        DRAFT: "draft",
        IN_REVIEW: "in_review",
        CONFIRMED: "confirmed",
        CHANGED: "changed",
        ARCHIVED: "archived"
    });

    var REQUIRED_FIELDS = Object.freeze([
        "operationId",
        "projectId",
        "title",
        "status",
        "currentVersion",
        "lifecycle",
        "unitProjects",
        "createdAt",
        "updatedAt"
    ]);

    namespace.Schema = Object.freeze({
        version: "1.0.0",
        status: STATUS,
        requiredFields: REQUIRED_FIELDS
    });
}(typeof globalThis !== "undefined" ? globalThis : this));
