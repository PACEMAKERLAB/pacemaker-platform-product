/** PACEMAKER Platform Product v2 - Operation Document Projector - Version 1.0.0 */
(function(global){"use strict";
var engine=global.PacemakerV2.Engine;engine.OperationProjection=engine.OperationProjection||{};var projection=engine.OperationProjection;
function key(requirement){return requirement.occurrenceId+":"+requirement.documentType;}
function project(operation,derivedWork,executionState){
var units=operation.unitProjects.map(function(unit){
var completed=Number(executionState.completedOccurrences[unit.unitProjectId])||0;
var occurrences=[];var round;
for(round=1;round<=unit.plannedCount;round+=1){
var occurrenceId=unit.unitProjectId+"-R"+String(round).padStart(3,"0");
var schedule=derivedWork.schedules.find(function(item){return item.occurrenceId===occurrenceId;});
var documents=derivedWork.documentRequirements.filter(function(item){return item.occurrenceId===occurrenceId;}).map(function(requirement){
var stored=executionState.documentStatus[key(requirement)];
var review=(executionState.documentReviewStatus||{})[key(requirement)];
var workflow=(executionState.documentWorkflowStatus||{})[key(requirement)];
return {documentRequirementId:requirement.documentRequirementId,documentType:requirement.documentType,title:requirement.title,reviewStatus:review||null,workflowStatus:workflow||null,status:review==="rejected"?"rejected":stored==="attached"?"attached":round<=completed?"missing":"planned"};
});
occurrences.push({occurrenceId:occurrenceId,round:round,scheduledDate:schedule?schedule.scheduledDate:null,executionStatus:round<=completed?"completed":schedule?"scheduled":"planning_required",documents:documents,attachedCount:documents.filter(function(item){return item.status==="attached";}).length,missingCount:documents.filter(function(item){return item.status==="missing";}).length});
}
var allDocuments=occurrences.reduce(function(list,item){return list.concat(item.documents);},[]);
return {unitProjectId:unit.unitProjectId,title:unit.title,plannedCount:unit.plannedCount,completedCount:completed,occurrences:occurrences,summary:{requiredCount:allDocuments.length,attachedCount:allDocuments.filter(function(item){return item.status==="attached";}).length,missingCount:allDocuments.filter(function(item){return item.status==="missing"||item.status==="rejected";}).length,plannedCount:allDocuments.filter(function(item){return item.status==="planned";}).length}};
});
var summaries=units.map(function(unit){return unit.summary;});
return {operationId:operation.operationId,operationVersion:operation.currentVersion,asOfDate:executionState.asOfDate,protocolRequirementCount:(operation.requirementAssignments||[]).length,units:units,summary:{unitProjectCount:units.length,occurrenceCount:units.reduce(function(sum,unit){return sum+unit.occurrences.length;},0),requiredCount:summaries.reduce(function(sum,item){return sum+item.requiredCount;},0),attachedCount:summaries.reduce(function(sum,item){return sum+item.attachedCount;},0),missingCount:summaries.reduce(function(sum,item){return sum+item.missingCount;},0),plannedCount:summaries.reduce(function(sum,item){return sum+item.plannedCount;},0)}};
}
projection.DocumentProjector=Object.freeze({project:project});
}(typeof globalThis!=="undefined"?globalThis:this));
