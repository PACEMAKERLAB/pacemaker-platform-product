/** PACEMAKER v2 Budget Control Projector */
(function (global) {
    "use strict";
    var engine = global.PacemakerV2.Engine;
    engine.Budget = engine.Budget || {};

    function sum(list, key) { return list.reduce(function (total, item) { return total + item[key]; }, 0); }
    function approvedExpenses(state, filter) {
        return state.expenseResolutions.filter(function (item) { return item.status === "approved" && filter(item); });
    }
    function project(input) {
        var state = input.budgetState;
        var approvedTotal = sum(state.categories, "approvedAmount");
        var categories = state.categories.map(function (category) {
            var expenses = approvedExpenses(state, function (item) { return item.categoryId === category.categoryId; });
            var used = sum(expenses, "amount");
            return Object.assign({}, category, {
                usedAmount: used,
                remainingAmount: category.approvedAmount - used,
                usageRate: category.approvedAmount ? Math.round(used / category.approvedAmount * 100) : 0,
                approvedShareRate: approvedTotal ? Math.round(category.approvedAmount / approvedTotal * 100) : 0,
                limitExceeded: used > category.approvedAmount,
                missingEvidenceCount: expenses.filter(function (item) { return !item.evidenceAttached; }).length,
                expenseCount: expenses.length
            });
        });
        var units = state.unitProjects.map(function (unit) {
            var expenses = approvedExpenses(state, function (item) { return item.unitProjectId === unit.unitProjectId; });
            var used = sum(expenses, "amount");
            return Object.assign({}, unit, {
                usedAmount: used,
                remainingAmount: unit.approvedAmount - used,
                usageRate: unit.approvedAmount ? Math.round(used / unit.approvedAmount * 100) : 0,
                missingEvidenceCount: expenses.filter(function (item) { return !item.evidenceAttached; }).length,
                expenseCount: expenses.length,
                categoryBreakdown: state.categories.map(function (category) {
                    var categoryExpenses = expenses.filter(function (item) { return item.categoryId === category.categoryId; });
                    return { categoryId: category.categoryId, title: category.title, approvedAmount: (category.unitAllocations || {})[unit.unitProjectId] || 0, usedAmount: sum(categoryExpenses, "amount") };
                }).filter(function (item) { return item.approvedAmount || item.usedAmount; }),
                occurrences: expenses.map(function (item) {
                    var category = state.categories.find(function (candidate) { return candidate.categoryId === item.categoryId; }) || {};
                    return { expenseResolutionId: item.expenseResolutionId, occurrenceId: item.occurrenceId, occurrenceNumber: Number((item.occurrenceId || "").split("R").pop()), categoryTitle: category.title, amount: item.amount, evidenceAttached: item.evidenceAttached };
                })
            });
        });
        var usedTotal = sum(categories, "usedAmount");
        return {
            operationVersion: state.operationVersion,
            categories: categories,
            units: units,
            expenses: state.expenseResolutions,
            summary: {
                approvedTotal: approvedTotal,
                usedTotal: usedTotal,
                remainingTotal: approvedTotal - usedTotal,
                usageRate: approvedTotal ? Math.round(usedTotal / approvedTotal * 100) : 0,
                pendingExpenseCount: state.expenseResolutions.filter(function (item) { return item.status === "pending"; }).length,
                missingEvidenceCount: categories.reduce(function (total, item) { return total + item.missingEvidenceCount; }, 0),
                limitWarningCount: categories.filter(function (item) { return item.limitExceeded; }).length
            }
        };
    }
    engine.Budget.ControlProjector = Object.freeze({ project: project });
}(typeof globalThis !== "undefined" ? globalThis : this));
