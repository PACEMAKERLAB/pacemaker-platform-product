/** PACEMAKER Platform Product v2 - My Project V002 Projection Test - Version 1.0.0 */
(function(global){"use strict";
function assert(condition,message){if(!condition){throw new Error(message);}}
function run(){
var state=global.PacemakerV2CommunityOperationV2Fixture.build("USR-EXPERT-0001");
var execution=global.PacemakerV2CommunityExecutionStateFixture;
var derived=global.PacemakerV2.Runtime.DerivedWork.execute(state.operation,{asOfDate:execution.asOfDate});
var overview=global.PacemakerV2.Engine.OperationProjection.OverviewProjector.project(state.operation,derived,execution,state);
var plan=global.PacemakerV2.Engine.OperationProjection.PlanProjector.project(state.operation,derived,execution);
var executionView=global.PacemakerV2.Engine.OperationProjection.ExecutionProjector.project(state.operation,derived,execution);
var newsletter=overview.unitProjects.find(function(item){return item.unitProjectId==="UNT-001";});
var newsletterExecution=executionView.units.find(function(item){return item.unitProjectId==="UNT-001";});
assert(overview.operationVersion==="V002","overview must use V002");
assert(overview.versionSummary.requirementCount===24,"overview must show 24 requirements");
assert(newsletter.plannedCount===2,"overview newsletter count must be 2");
assert(plan.summary.plannedOccurrenceCount===15,"plan total occurrences must be 15");
assert(plan.summary.requirementAssignmentCount===24,"plan must show 24 requirements");
assert(newsletterExecution.rounds.length===2,"execution must exclude removed round 3");
assert(overview.history.length===2,"overview must expose two history events");
return {passed:true,operationVersion:overview.operationVersion,requirementCount:overview.versionSummary.requirementCount,newsletterPlannedCount:newsletter.plannedCount,totalPlannedOccurrenceCount:plan.summary.plannedOccurrenceCount,newsletterExecutionRoundCount:newsletterExecution.rounds.length,historyCount:overview.history.length,recentChange:overview.recentChange.title};
}
global.PacemakerV2MyProjectV2ProjectionTest=Object.freeze({run:run});
}(typeof globalThis!=="undefined"?globalThis:this));
