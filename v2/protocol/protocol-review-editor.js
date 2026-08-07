/** PACEMAKER Platform Product v2 - Protocol Review Editor - Version 1.0.0 */
(function (global) {
    "use strict";
    var protocol = global.PacemakerV2.Protocol;

    function normalizeGaps(items) {
        return items.map(function (item, index) {
            return typeof item === "string"
                ? { gapId: "GAP-" + String(index + 1).padStart(3, "0"), title: item, decision: null }
                : item;
        });
    }

    function apply(draft, edit) {
        var definition = protocol.ReviewPolicy.collections[edit.section];
        var updated = protocol.DraftModel.clone(draft);
        var collection;
        var index;

        if (draft.status !== protocol.DraftSchema.status.IN_REVIEW) {
            throw new Error("Protocol edits are allowed only during review");
        }
        if (!definition) { throw new Error("Unknown Protocol review section: " + edit.section); }

        if (edit.section === "gaps") {
            updated.gaps = normalizeGaps(updated.gaps);
        }
        collection = updated[edit.section];
        index = collection.findIndex(function (item) { return item[definition.idField] === edit.itemId; });

        if (edit.action === "add") {
            if (!edit.item || !edit.item[definition.idField]) { throw new Error("Added item requires " + definition.idField); }
            if (collection.some(function (item) { return item[definition.idField] === edit.item[definition.idField]; })) {
                throw new Error("Duplicate Protocol item id");
            }
            collection.push(protocol.DraftModel.clone(edit.item));
        } else if (edit.action === "update") {
            if (index === -1) { throw new Error("Protocol item not found: " + edit.itemId); }
            collection[index] = Object.assign({}, collection[index], protocol.DraftModel.clone(edit.changes || {}));
            collection[index][definition.idField] = edit.itemId;
        } else if (edit.action === "remove") {
            if (index === -1) { throw new Error("Protocol item not found: " + edit.itemId); }
            collection.splice(index, 1);
        } else {
            throw new Error("Unknown Protocol edit action: " + edit.action);
        }

        updated.review.sectionConfirmations[edit.section] = false;
        updated.updatedAt = edit.editedAt;
        return updated;
    }

    protocol.ReviewEditor = Object.freeze({ apply: apply, normalizeGaps: normalizeGaps });
}(typeof globalThis !== "undefined" ? globalThis : this));
