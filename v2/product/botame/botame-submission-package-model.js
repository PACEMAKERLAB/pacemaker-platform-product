/** PACEMAKER Platform Product v2 - Botam-e Submission Package Model - Version 1.0.0 */
(function (global) {
    "use strict";
    var product = global.PacemakerV2.Product;
    product.Botame = product.Botame || {};

    function create(input) {
        return Object.freeze({
            submissionPackageId: input.submissionPackageId,
            expenseResolutionId: input.expenseResolutionId,
            operationVersion: input.operationVersion,
            unitProjectId: input.unitProjectId,
            occurrenceId: input.occurrenceId,
            categoryId: input.categoryId,
            amount: Number(input.amount) || 0,
            status: input.status,
            downloadFileName: input.downloadFileName,
            files: Object.freeze(input.files || []),
            manifest: Object.freeze(input.manifest || {}),
            generatedAt: input.generatedAt,
            generatedBy: input.generatedBy
        });
    }

    product.Botame.SubmissionPackageModel = Object.freeze({ create: create });
}(typeof globalThis !== "undefined" ? globalThis : this));
