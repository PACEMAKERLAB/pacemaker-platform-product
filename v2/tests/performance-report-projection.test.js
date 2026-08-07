/** PACEMAKER Platform Product v2 - Performance Report Projection Test - Version 1.0.0 */
(function (global) {
    "use strict";
    function assert(condition, message) { if (!condition) { throw new Error(message); } }

    function run() {
        var version = global.PacemakerV2CommunityOperationV2Fixture.build("USR-EXPERT-0001");
        var operation = version.operation;
        var execution = JSON.parse(JSON.stringify(global.PacemakerV2CommunityExecutionStateFixture));
        var derived = global.PacemakerV2.Runtime.DerivedWork.execute(operation, { asOfDate: execution.asOfDate });
        var overview = global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(operation, derived, execution, version);
        var documents = global.PacemakerV2.Engine.OperationProjection.DocumentProjector.project(operation, derived, execution);
        var budgetState = JSON.parse(JSON.stringify(global.PacemakerV2CommunityBudgetStateFixture));
        var pendingIndex = budgetState.expenseResolutions.findIndex(function (item) { return item.status === "expert_review_pending"; });
        budgetState.expenseResolutions[pendingIndex].status = "botame_completed";
        var budget = global.PacemakerV2.Engine.Budget.ControlProjector.project({ budgetState: budgetState });
        var report = global.PacemakerV2.Engine.OperationProjection.PerformanceReportProjector.project({
            operation: operation, overviewView: overview, documentView: documents, budgetView: budget, asOfDate: execution.asOfDate
        });

        assert(report.operationVersion === "V002", "performance report must use confirmed V002");
        assert(report.summary.plannedExecutionCount === 15 && report.summary.completedExecutionCount === 6, "execution counts must match Operation");
        assert(report.summary.executionRate === 40, "execution rate must be 40%");
        assert(report.summary.evidenceRequiredCount === 18 && report.summary.evidenceAttachedCount === 16, "completed evidence counts must match");
        assert(report.summary.evidenceCompletionRate === 89, "evidence completion rate must be 89%");
        assert(report.summary.usedBudget === 7600000 && report.summary.budgetUsageRate === 38, "budget performance must match Botam-e completion");
        assert(report.reportStatus === "preparation_required", "unfinished project must not be report-ready");
        assert(report.summary.blockerCount === 4, "four report blockers must be shown");
        assert(report.unitProjects.length === 3 && report.reportSections.length === 4, "unit and report sections must be projected");

        return {
            passed: true,
            operationVersion: report.operationVersion,
            reportStatus: report.reportStatus,
            plannedExecutionCount: report.summary.plannedExecutionCount,
            completedExecutionCount: report.summary.completedExecutionCount,
            executionRate: report.summary.executionRate,
            evidenceRequiredCount: report.summary.evidenceRequiredCount,
            evidenceAttachedCount: report.summary.evidenceAttachedCount,
            evidenceMissingCount: report.summary.evidenceMissingCount,
            evidenceCompletionRate: report.summary.evidenceCompletionRate,
            usedBudget: report.summary.usedBudget,
            budgetUsageRate: report.summary.budgetUsageRate,
            reportBlockerCount: report.summary.blockerCount,
            reportSectionCount: report.reportSections.length,
            deterministic: true
        };
    }
    global.PacemakerV2PerformanceReportProjectionTest = Object.freeze({ run: run });
}(typeof globalThis !== "undefined" ? globalThis : this));
