/** PACEMAKER Platform Product v2 - Botam-e Submission Runtime - Version 1.0.0 */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;

    function generate(input) {
        var submissionPackage = global.PacemakerV2.Engine.BotameSubmission.PackageGenerator.generate(input);
        return Object.freeze({
            submissionPackage: submissionPackage,
            historyEvent: Object.freeze({
                historyEventId: input.historyEventId,
                eventType: "botame_submission_package_generated",
                targetId: submissionPackage.expenseResolutionId,
                occurredAt: input.generatedAt,
                actorId: input.generatedBy,
                metadata: {
                    submissionPackageId: submissionPackage.submissionPackageId,
                    fileCount: submissionPackage.files.length
                }
            })
        });
    }

    runtime.BotameSubmission = Object.freeze({ generate: generate });
}(typeof globalThis !== "undefined" ? globalThis : this));
