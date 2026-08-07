/** PACEMAKER Platform Product v2 - Protocol Review Runtime - Version 1.0.0 */
(function (global) {
    "use strict";
    var runtime = global.PacemakerV2.Runtime;
    var protocol = global.PacemakerV2.Protocol;

    function event(type, input) {
        return {
            historyEventId: input.historyEventId,
            protocolDraftId: input.protocolDraftId,
            eventType: type,
            section: input.section || null,
            actorId: input.actorId,
            reason: input.reason || null,
            occurredAt: input.occurredAt
        };
    }

    function open(draft, input) {
        var updated = protocol.DraftModel.clone(draft);
        updated.status = protocol.DraftSchema.status.IN_REVIEW;
        updated.gaps = protocol.ReviewEditor.normalizeGaps(updated.gaps || []);
        updated.review = {
            reviewerId: input.expertId,
            openedAt: input.at,
            sectionConfirmations: {
                lifecycleStages: false,
                requirementRules: false,
                externalActions: false,
                gaps: false
            }
        };
        return {
            draft: updated,
            historyEvents: [event("protocol_review_opened", {
                historyEventId: input.historyEventId,
                protocolDraftId: updated.protocolDraftId,
                actorId: input.expertId,
                occurredAt: input.at
            })]
        };
    }

    function edit(session, input) {
        var updated = protocol.ReviewEditor.apply(session.draft, {
            section: input.section,
            action: input.action,
            itemId: input.itemId,
            item: input.item,
            changes: input.changes,
            editedAt: input.at
        });
        return {
            draft: updated,
            historyEvents: session.historyEvents.concat([event("protocol_review_edited", {
                historyEventId: input.historyEventId,
                protocolDraftId: updated.protocolDraftId,
                section: input.section,
                actorId: input.expertId,
                reason: input.action,
                occurredAt: input.at
            })])
        };
    }

    function confirmSection(session, input) {
        var updated = protocol.DraftModel.clone(session.draft);
        if (protocol.ReviewPolicy.sections.indexOf(input.section) === -1) {
            throw new Error("Unknown Protocol review section: " + input.section);
        }
        updated.review.sectionConfirmations[input.section] = true;
        return {
            draft: updated,
            historyEvents: session.historyEvents.concat([event("protocol_review_section_confirmed", {
                historyEventId: input.historyEventId,
                protocolDraftId: updated.protocolDraftId,
                section: input.section,
                actorId: input.expertId,
                occurredAt: input.at
            })])
        };
    }

    function confirm(session, input) {
        var validation;
        var confirmed;
        if (!protocol.ReviewPolicy.allSectionsConfirmed(session.draft)) {
            throw new Error("All Protocol review sections must be confirmed");
        }
        validation = protocol.DraftValidator.validate(session.draft);
        if (!validation.valid) { throw new Error("Invalid Protocol Draft: " + validation.errors.join(", ")); }

        confirmed = protocol.DraftModel.clone(session.draft);
        confirmed.status = protocol.DraftSchema.status.CONFIRMED;
        confirmed.protocolVersion = "V001";
        confirmed.confirmedAt = input.at;
        confirmed.confirmedBy = input.expertId;
        confirmed.updatedAt = input.at;
        return {
            protocol: Object.freeze(confirmed),
            historyEvents: session.historyEvents.concat([event("protocol_version_created", {
                historyEventId: input.historyEventId,
                protocolDraftId: confirmed.protocolDraftId,
                actorId: input.expertId,
                reason: confirmed.protocolVersion,
                occurredAt: input.at
            })])
        };
    }

    runtime.ProtocolReview = Object.freeze({ open: open, edit: edit, confirmSection: confirmSection, confirm: confirm });
}(typeof globalThis !== "undefined" ? globalThis : this));
