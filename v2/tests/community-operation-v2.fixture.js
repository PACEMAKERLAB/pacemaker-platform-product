/** PACEMAKER Platform Product v2 - Community Operation V002 Fixture - Version 1.0.0 */
(function (global) {
    "use strict";
    function protocol(expertId) {
        var draft = global.PacemakerV2.Engine.ProtocolGeneration.DraftGenerator.generate({
            protocolDraftId:"PTD-COMMUNITY-2026-001", protocolId:"PTC-COMMUNITY-001",
            manualAnalysisResult:global.PacemakerV2CommunityManualAnalysisFixture, createdAt:"2026-08-07T20:00:00.000Z"
        });
        var runtime = global.PacemakerV2.Runtime.ProtocolReview;
        var session = runtime.open(draft,{expertId:expertId,historyEventId:"HST-PV-001",at:"2026-08-07T20:01:00.000Z"});
        ["lifecycleStages","requirementRules","externalActions","gaps"].forEach(function(section,index){
            session=runtime.confirmSection(session,{section:section,expertId:expertId,historyEventId:"HST-PV-01"+index,at:"2026-08-07T20:1"+index+":00.000Z"});
        });
        return runtime.confirm(session,{expertId:expertId,historyEventId:"HST-PV-020",at:"2026-08-07T20:20:00.000Z"}).protocol;
    }
    function build(expertId) {
        var fixture=global.PacemakerV2CommunityOperationDraftFixture;
        var analysis=global.PacemakerV2.Engine.DocumentAnalysis.ResultModel.create(fixture.analysisResult);
        var recommendation=global.PacemakerV2.Engine.ProtocolRecommendation.Model.create(fixture.protocolRecommendation);
        var confirmedProtocol=protocol(expertId);
        var v1=global.PacemakerV2.Engine.OperationGeneration.ProtocolOperationMerger.merge({operationId:"OPR-2026-0001",confirmedProtocol:confirmedProtocol,analysisResult:analysis,protocolRecommendation:recommendation,createdBy:expertId,createdAt:"2026-08-07T20:30:00.000Z"});
        v1.status="confirmed";v1.currentVersion="V001";v1.confirmation={confirmedAt:"2026-08-07T20:35:00.000Z",confirmedBy:expertId};
        var proposed=global.PacemakerV2.Operation.Model.clone(analysis);
        proposed.unitProjects[0].title="가을호 소식지";proposed.unitProjects[0].plannedCount=2;proposed.unitProjects[0].occurrenceDates=proposed.unitProjects[0].occurrenceDates.slice(0,2);
        var impact=global.PacemakerV2.Engine.OperationChange.ImpactAnalyzer.analyze({changeImpactId:"CIM-2026-0001",currentOperation:v1,proposedAnalysisResult:proposed,confirmedProtocol:confirmedProtocol,executionState:global.PacemakerV2CommunityExecutionStateFixture,requestedChange:{unitProjectId:"UNT-001",title:"마을 소식지",field:"plannedCount",before:3,after:2},analyzedAt:"2026-08-07T20:40:00.000Z",analyzedBy:expertId});
        var result=global.PacemakerV2.Runtime.OperationChange.confirm({currentOperation:v1,proposedAnalysisResult:proposed,changeImpact:impact,changeRequestId:"CRQ-2026-0001",reason:"여름호 대체 사업 추진",confirmedAt:"2026-08-07T20:45:00.000Z",confirmedBy:expertId});
        return {operation:result.operation,previousVersions:result.previousVersions,historyEvents:result.historyEvents,changeImpact:impact};
    }
    global.PacemakerV2CommunityOperationV2Fixture=Object.freeze({build:build});
}(typeof globalThis!=="undefined"?globalThis:this));
